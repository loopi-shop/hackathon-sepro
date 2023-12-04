import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { auth } from "../utils/firebase";
import {deployOnChain} from "../utils/on-chainid";

export const RoleEnum = {
  ADMIN: 'admin',
  COMMON: 'common',
}

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.
export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    const payload = isAuthenticated
      ? JSON.parse(window.sessionStorage.getItem('user'))
      : undefined;

    dispatch({
      type: HANDLERS.INITIALIZE,
      payload,
    });
  };

  useEffect(
    () => { initialize(); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = async () => {
    const { user } = await auth.signIn('admin@loopipay.com', 'ffad1b65-7a9c-4b21-94e8-088182ecbfeb');

    try {
      window.sessionStorage.setItem('authenticated', 'true');
      window.sessionStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }

    dispatch({ type: HANDLERS.SIGN_IN, payload: user });
  };

  const signIn = async (email, password) => {
    const { user } = await auth.signIn(email, password);

    try {
      window.sessionStorage.setItem('authenticated', 'true');
      window.sessionStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }

    dispatch({ type: HANDLERS.SIGN_IN, payload: user });
  };

  /**
   * @param email {string}
   * @param password {string}
   * @param metadata {{
   *   publicKey: string,
   *   name: string,
   *   country: number,
   *   taxId: string,
   *   kyc?: any,
   * }}
   * @return {Promise<void>}
   */
  const signUp = async (email, password, metadata) => {
    metadata.kyc = await deployOnChain(metadata.publicKey, metadata.country);
    const { user } = await auth.register(email, password, metadata);

    try {
      window.sessionStorage.setItem('authenticated', 'true');
      window.sessionStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }

    dispatch({ type: HANDLERS.SIGN_IN, payload: user });
  };

  const signOut = () => {
    try {
      window.sessionStorage.setItem('authenticated', 'false');
    } catch (err) {
      console.error(err);
    }

    dispatch({ type: HANDLERS.SIGN_OUT });
  };

  /**
   * @param {[]} roles
   */
  const hasRole = (roles) => {
    return roles.includes(state?.user?.role ?? RoleEnum.COMMON);
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);