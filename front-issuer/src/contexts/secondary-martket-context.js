import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { ethers, Contract, Interface, JsonRpcProvider, Wallet } from 'ethers';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import SECONDARY_MARKET_ABI from '../abis/secondary-market.json';
import TPF_ABI from '../abis/tpf-abi.json';


const SecondaryMarkeyContractInterface = new Interface(SECONDARY_MARKET_ABI);
const TPFContractInterface = new Interface(TPF_ABI);


export const SecondaryMarketContext = createContext({
  /**
   * @returns {Promise<{ data: string, to: string, nonce: number, value: string }>}
   */
  approve: async ({ amount, from, asset }) => { },
  /**
   * @returns {Promise<any>}
   */
  waitTransaction: async ({ txHash }) => { },
  /**
   * @returns {Promise<{ data: string, to: string, nonce: number, value: string }>}
   */
  createListing: async ({ from, token, amount, price }) => { },
});

export const SecondaryMarketProvider = (props) => {
  const { children } = props;
  const providerRef = useRef(new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL, Number(process.env.NEXT_PUBLIC_CHAIN_ID)));

  const approve = async ({ amount, from, asset }) => {
    const data = TPFContractInterface.encodeFunctionData("approve", [process.env.NEXT_PUBLIC_SECONDARY_MARKET, amount]);
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

  const createListing = async ({ from, token, amount, price }) => {
    const data = SecondaryMarkeyContractInterface.encodeFunctionData('createListing', [token, amount, price]);
    const tx = {
      data,
      value: "0",
      to: process.env.NEXT_PUBLIC_SECONDARY_MARKET,
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

  const waitTransaction = async ({ txHash }) => {
    console.info(`waiting transaction...`);
    return providerRef.current.waitForTransaction(txHash);
  }

  return (
    <SecondaryMarketContext.Provider
      value={{
        approve,
        createListing,
        waitTransaction,
      }}
    >
      {children}
    </SecondaryMarketContext.Provider>
  );
};

SecondaryMarketProvider.propTypes = {
  children: PropTypes.node
};

export const SecondaryMarketConsumer = SecondaryMarketContext.Consumer;

export const useSecondaryMarketContext = () => useContext(SecondaryMarketContext);
