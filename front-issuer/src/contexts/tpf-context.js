import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import investmentsRepository from 'src/repositories/investments.repository';
import { useAuth } from 'src/hooks/use-auth';
import { Interface, JsonRpcProvider } from 'ethers';
import BigNumber from 'bignumber.js';

const TPF_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currentTimestamp",
        "type": "uint256"
      }
    ],
    "name": "getPrice",
    "outputs": [
      {
        "internalType": "UD60x18",
        "name": "result",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "redeemAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "previewDeposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
]
const TPFContractInterface = new Interface(TPF_ABI);

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
  /**
   * @returns {Promise<{ data: string, to: string, nonce: number, value: string }>}
   */
  invest: async ({ amount, receiver, contractAddress, timestamp }) => { },
  /**
   * @returns {Promise<number>}
   */
  getPrice: async ({ contractAddress, timestamp }) => { },
  /**
   * @returns {Promise<{ data: string, to: string, nonce: number, value: string }>}
   */
  approve: async ({ amount, contractAddress, asset }) => { },
  /**
   * @returns {Promise<any>}
   */
  waitTransaction: async ({ txHash }) => { },
  /**
   * @returns {Promise<{ data: string, to: string, nonce: number, value: string }>}
   */
  redeem: async ({ contractAddress, from }) => { },
  /**
   * @returns {Promise<number>}
   */
  simulate: async ({ amount, contractAddress, timestamp }) => { }
});

export const TPFProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated } = useAuth();
  const providerRef = useRef(new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL, Number(process.env.NEXT_PUBLIC_CHAIN_ID)));

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

  const approve = async ({ amount, from, contractAddress, asset }) => {
    const data = TPFContractInterface.encodeFunctionData("approve", [contractAddress, amount]);
    const tx = {
      data,
      value: "0",
      to: asset,
      from: from,
    };
    const [nonce, gasPrice, gasEstimated] = await Promise.all([
      providerRef.current.getTransactionCount(from).then((curNonce) => curNonce ?? 0),
      providerRef.current.send("eth_gasPrice", []),
      providerRef.current.estimateGas(tx)
    ]);

    return {
      ...tx,
      nonce: `0x${new BigNumber(nonce).toString(16)}`,
      gasPrice: gasPrice,
      gasLimit: `0x${new BigNumber(gasEstimated).multipliedBy(1.50).toString(16)}`,
    }
  }

  const invest = async ({ amount, receiver, contractAddress, timestamp }) => {
    const data = TPFContractInterface.encodeFunctionData("deposit", [amount, receiver, parseInt(timestamp)]);
    const tx = {
      data,
      value: "0",
      to: contractAddress,
      from: receiver,
    };
    const [nonce, gasPrice] = await Promise.all([
      providerRef.current.getTransactionCount(receiver).then((curNonce) => curNonce ?? 0),
      providerRef.current.send("eth_gasPrice", []),
    ]);

    return {
      ...tx,
      nonce: `0x${new BigNumber(nonce).toString(16)}`,
      gasPrice: gasPrice,
    }
  }

  const getPrice = async ({ contractAddress, timestamp }) => {
    const data = TPFContractInterface.encodeFunctionData('getPrice', [parseInt(timestamp)]);
    const response = await providerRef.current.call({
      to: contractAddress,
      data,
      value: 0,
    });
    return new BigNumber(response).toNumber();
  }

  const waitTransaction = async ({ txHash }) => {
    console.info(`waiting transaction...`);
    return providerRef.current.waitForTransaction(txHash);
  }

  const redeem = async ({ contractAddress, from }) => {
    const data = TPFContractInterface.encodeFunctionData("redeemAll", []);
    const tx = {
      data,
      value: "0",
      to: contractAddress,
      from: from,
    };
    const [nonce, gasPrice] = await Promise.all([
      providerRef.current.getTransactionCount(from).then((curNonce) => curNonce ?? 0),
      providerRef.current.send("eth_gasPrice", []),
    ]);

    return {
      ...tx,
      nonce: `0x${new BigNumber(nonce).toString(16)}`,
      gasPrice: gasPrice,
    }
  }

  const simulate = async ({ amount, contractAddress, timestamp }) => {
    const data = TPFContractInterface.encodeFunctionData("previewDeposit", [amount, parseInt(timestamp)]);
    const response = await providerRef.current.call({
      to: contractAddress,
      data,
      value: 0,
    });
    return new BigNumber(response).toNumber();
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
        invest,
        getPrice,
        approve,
        waitTransaction,
        redeem,
        simulate,
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