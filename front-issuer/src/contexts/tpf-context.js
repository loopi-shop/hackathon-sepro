import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { delay } from 'src/utils/delay';
import { useAuth } from 'src/hooks/use-auth';

const HANDLERS = {
  LIST: 'LIST',
};

const initialState = {
  tpfs: {
    isLoading: false,
    data: []
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
  list: async () => { }
});

export const TPFProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated } = useAuth();

  const list = async () => {
    // Delay to simulate firebase interaction
    dispatch({
      type: HANDLERS.LIST,
      isLoading: true,
      payload: [],
    });
    await delay(5000);
    const data = [
      {
        id: 'Titulo1',
        acronym: 'Título 1',
        expirationDate: '10/10/2021',
        totalIssued: '100.000,00',
        minimumValue: '1.000,00',
        profitability: '10%',
        settle: 'Liquidar título'
      },
      {
        id: 'Titulo2',
        acronym: 'Título 2',
        expirationDate: '10/12/2021',
        totalIssued: '1.000.000,00',
        minimumValue: '10.000,00',
        profitability: '20%',
        settle: 'Liquidar título'
      },
    ];
    dispatch({
      type: HANDLERS.LIST,
      isLoading: false,
      payload: data
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