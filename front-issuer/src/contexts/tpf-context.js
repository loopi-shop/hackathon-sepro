import { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import investmentsRepository from 'src/repositories/investments.repository';
import { useAuth } from 'src/hooks/use-auth';

const HANDLERS = {
  LIST: 'LIST',
  CREATE: 'CREATE',
};

const initialState = {
  tpfs: {
    isLoading: false,
    /**
     * @type {import("src/repositories/investments.repository").TPF[]}
     */
    data: [],
  },
  tpf: {
    isLoading: false,
    /**
     * @type {import("src/repositories/investments.repository").TPF}
     */
    data: null,
  }
};

const handlers = {
  [HANDLERS.LIST]: (state, action) => {
    return {
      ...state,
      tpfs: {
        isLoading: action.isLoading,
        data: action.payload,
      }
    };
  },
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate tpf state through the App tree.

export const TPFContext = createContext({
  ...initialState,
  list: async () => { },
  /**
   * @param {Omit<import("src/repositories/investments.repository").TPF, "id">} tpf 
   */
  create: async (tpf) => { },
});

export const TPFProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated } = useAuth();

  const create = async (tpf) => {
    dispatch({
      type: HANDLERS.CREATE,
      isLoading: true,
      payload: null,
    });
    const created = await investmentsRepository.create(tpf);
    dispatch({
      type: HANDLERS.CREATE,
      isLoading: false,
      payload: created,
    });
  }

  const list = async () => {
    dispatch({
      type: HANDLERS.LIST,
      isLoading: true,
      payload: [],
    });
    const investments = await investmentsRepository.list();

    dispatch({
      type: HANDLERS.LIST,
      isLoading: false,
      payload: investments
    });
  }

  useEffect(
    () => {
      if (isAuthenticated) list();
    },
    [isAuthenticated]
  );

  return (
    <TPFContext.Provider
      value={{
        ...state,
        list,
        create,
      }}
    >
      {children}
    </TPFContext.Provider>
  );
};

TPFProvider.propTypes = {
  children: PropTypes.node
};

export const TPFConsumer = TPFContext.Consumer;

export const useTPFContext = () => useContext(TPFContext);