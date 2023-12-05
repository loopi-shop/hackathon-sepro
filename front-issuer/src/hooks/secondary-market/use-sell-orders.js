import { useEffect, useState } from 'react';
import secondaryMarket from "../../utils/secondary-market";
import {useAuth} from "../use-auth";
import {ethers} from "ethers";
import BigNumber from "bignumber.js";
import secondaryMarketAbi from '../../abis/secondary-market.json';

export function useSellOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    secondaryMarket.listOrders().then(completeList => {
      const list = completeList.filter(order => order.seller !== user.publicKey);

      setOrders(list);
    });
  }, []);

  /**
   * @param order {{internalId: string, quantity: string, isCanceled: boolean, isSold: boolean, yield: number, name: string, sellPrice: string, seller: string, expirationDate: string, contractAddress: string}}
   */
  const buyOrder = async (order) => {
    const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
    console.info('Starting process to buy', { order, signer });
    const abi = {
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
    };
    const erc20Contract = new ethers.Contract(process.env.NEXT_PUBLIC_BRLX_CONTRACT, [abi], signer);
    const allowanceTx = await erc20Contract.approve(process.env.NEXT_PUBLIC_SECONDARY_MARKET, new BigNumber(order.sellPrice).shiftedBy(6).toFixed(0));
    const allowanceRes = await allowanceTx.wait(1)
    console.info('Allowance response', allowanceRes);
    if(!allowanceRes.status) throw Error('Falha ao realizar o Allowance do valor.');

    const secondaryMarketContract = new ethers.Contract(process.env.NEXT_PUBLIC_SECONDARY_MARKET, secondaryMarketAbi, signer);
    const orderTx = await secondaryMarketContract.buyTokens(order.internalId);
    console.info('Order Processing...', orderTx)
    const orderRes = await orderTx.wait(1)
    console.info('Order Result', orderRes);
    if (orderRes.status) {
      window.location.reload();
      return orderRes;
    }

    throw Error('Falha no processamento do pedido.')
  };

  return { orders, buyOrder };
}