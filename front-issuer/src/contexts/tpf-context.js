import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import investmentsRepository from 'src/repositories/investments.repository';
import { useAuth } from 'src/hooks/use-auth';
import { ethers, Contract, Interface, JsonRpcProvider, Wallet } from 'ethers';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import TPF_ABI from '../abis/tpf-abi.json';

/**
 * @typedef TPF_API
 * @property {number[]} blockListCountryCode
 * @property {number} decimals
 * @property {number} duration Duration Days
 * @property {string} identityRegistry address of idendity
 * @property {string} name
 * @property {string} maxAssets Numeric string
 * @property {string} stableToken Numeric string
 * @property {string} startTimestamp epoc
 * @property {string} stableAddress Numeric string
 * @property {string} symbol
 * @property {string} yieldPercentage Numeric string **6 decimals**
 */

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
  [HANDLERS.CREATE]: (state, action) => {
    return {
      ...state,
      tpf: {
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
  /**
   * @returns {Promise<import("src/repositories/investments.repository").TPF[]>}
   */
  list: async () => { },
  /**
   * @returns {Promise<{ publicKey: string, isFrozen: boolean }[]>}
   */
  listHolders: async ({ contractAddress }) => { },
  /**
   * @param {Omit<import("src/repositories/investments.repository").TPF, "id">} tpf
   * @returns {Promise<import("src/repositories/investments.repository").TPF>}
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
   * @returns {Promise<number>}
   */
  getTotalAssets: async ({ contractAddress }) => { },
  /**
   * @returns {Promise<number>}
   */
  getTotalSupply: async ({ contractAddress }) => { },
  /**
   * @returns {Promise<number>}
   */
  balanceOf: async ({ contractAddress, accountAddress }) => { },
  /**
   * @returns {Promise<number>}
   */
  balanceOfAsset: async ({ contractAddress, accountAddress, assetAddress }) => { },
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
   * @returns {Promise<{ data: string, to: string, nonce: number, value: string }>}
   */
  withdraw: async ({ contractAddress, from, destinationAddress, amount }) => { },
  /**
   * @return {Promise<{ result: any, transaction: any }>}
   */
  transfer: async ({ contractAddress, quantity, signer, to }) => { },
  /**
   * @returns {Promise<number>}
   */
  simulate: async ({ amount, contractAddress, timestamp }) => { },
  /**
   * @returns {Promise<{ txHash: string }>}
   */
  broadcast: async ({ tx }) => { },
  /**
   @returns {Promise<{ data: string, to: string, nonce: number, value: string }>}
   */
  setFrozen: async ({ contractAddress, frozen, walletAddress }) => { },
});

export const TPFProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated } = useAuth();
  const providerRef = useRef(new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL, Number(process.env.NEXT_PUBLIC_CHAIN_ID)));

  /**
   * @param {TPF_API} tpf
   * @returns {Promise<{ defaultCompliance: string, tokenImplementation: string }>}
   */
  const register = async (tpf) => {
    const api_url = process.env.NEXT_PUBLIC_DEPLOY_CONTRACT_API_URL;
    const { data: output } = await axios.post(api_url, tpf);
    return output;
  }

  /**
   * @param {Omit<import("src/repositories/investments.repository").TPF, "id">} tpf
   */
  const createWithDefaults = async (tpf) => {
    dispatch({
      type: HANDLERS.CREATE,
      isLoading: true,
      payload: null,
    });
    try {
      let startDate = new Date();
      if (tpf.startDate) {
        startDate = new Date(tpf.startDate);
        const userTimezoneOffset = startDate.getTimezoneOffset() * 60000;
        startDate = new Date(startDate.getTime() + userTimezoneOffset);
      }
      /**
       * @type {TPF_API}
       */
      const payloadAPI = {
        decimals: 6,
        blockListCountryCode: tpf.blocklistCountryCode,
        duration: tpf.durationDays,
        identityRegistry: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY,
        maxAssets: tpf.maxAssets,
        name: tpf.name,
        stableAddress: process.env.NEXT_PUBLIC_BRLX_CONTRACT,
        stableToken: process.env.NEXT_PUBLIC_BRLX_CONTRACT,
        symbol: tpf.symbol,
        startTimestamp: parseInt(startDate.getTime() / 1000),
        yieldPercentage: tpf.yield * 10 ** 4,
      }
      const outputCreatedContract = await register(payloadAPI);
      /**
       * @type {Omit<import("src/repositories/investments.repository").TPF, "id">}
       */
      const tpfFilled = {
        asset: payloadAPI.stableToken,
        decimals: payloadAPI.decimals,
        contractAddress: outputCreatedContract.tokenImplementation,
        durationDays: tpf.durationDays,
        maxAssets: tpf.maxAssets,
        name: tpf.name,
        startTimestamp: startDate,
        symbol: tpf.symbol,
        yield: tpf.yield,
        _identityRegistry: payloadAPI.identityRegistry,
        _compliance: outputCreatedContract.defaultCompliance,
      };
      const created = await investmentsRepository.create(tpfFilled);
      dispatch({
        type: HANDLERS.CREATE,
        isLoading: false,
        payload: created,
      });
      return created;
    } catch (error) {
      dispatch({
        type: HANDLERS.CREATE,
        isLoading: false,
        payload: null,
      });
      throw error;
    }
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

  const listHolders = async ({ contractAddress }) => {
    const contract = new Contract(contractAddress, TPF_ABI, providerRef.current);
    let holders = await contract.holders();

    return Promise.all(holders.map(async (holder) => {
      const isFrozen = await contract.isFrozen(holder);

      return {
        publicKey: holder,
        isFrozen,
      };
    }));
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

  const getTotalAssets = async ({ contractAddress }) => {
    const data = TPFContractInterface.encodeFunctionData('totalAssets', []);
    const response = await providerRef.current.call({
      to: contractAddress,
      data,
      value: 0,
    });
    return new BigNumber(response).toNumber();
  }

  const getTotalSupply = async ({ contractAddress }) => {
    const data = TPFContractInterface.encodeFunctionData('totalSupply', []);
    const response = await providerRef.current.call({
      to: contractAddress,
      data,
      value: 0,
    });
    return new BigNumber(response).toNumber();
  }

  const balanceOf = async ({ contractAddress, accountAddress }) => {
    const data = TPFContractInterface.encodeFunctionData('balanceOf', [accountAddress]);
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

  const transfer = async ({ contractAddress, quantity, signer, to }) => {
    try {

      const erc20Contract = new ethers.Contract(contractAddress, TPF_ABI, signer);
      const transaction = await erc20Contract.transfer(to, quantity);
      const result = await transaction.wait(1);

      if (result.status === 1) {
        return { result, transaction };
      }

      console.info('Transaction Result', result);
      throw Error('Transfer tokens failed');
    } catch (e) {
      console.info('Input for transfer');
      console.info('Internal data');

      console.error(e);
      throw e;
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

  const broadcast = async ({ tx }) => {
    const wallet = new Wallet(process.env.NEXT_PUBLIC_ADM_PRIVATE_KEY, providerRef.current);
    const response = await wallet.sendTransaction(tx);
    return {
      txHash: response.hash,
    }
  }

  const withdraw = async ({ contractAddress, from, destinationAddress, amount }) => {
    const data = TPFContractInterface.encodeFunctionData("withdrawAssets", [destinationAddress, amount]);
    const tx = {
      data,
      value: "0",
      to: contractAddress,
      from: from,
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

  const balanceOfAsset = async ({ contractAddress, accountAddress, assetAddress }) => {
    const data = TPFContractInterface.encodeFunctionData('balanceOf', [contractAddress]);
    const response = await providerRef.current.call({
      to: assetAddress,
      from: accountAddress,
      data,
      value: 0,
    });
    return new BigNumber(response).toNumber();
  }

  const setFrozen = async ({ contractAddress, frozen, walletAddress }) => {
    const data = TPFContractInterface.encodeFunctionData('setAddressFrozen', [walletAddress, frozen]);
    return {
      to: contractAddress,
      data,
      value: '0',
    };
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
        listHolders,
        create: createWithDefaults,
        invest,
        getPrice,
        approve,
        waitTransaction,
        redeem,
        transfer,
        simulate,
        broadcast,
        balanceOf,
        getTotalAssets,
        getTotalSupply,
        withdraw,
        balanceOfAsset,
        setFrozen,
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