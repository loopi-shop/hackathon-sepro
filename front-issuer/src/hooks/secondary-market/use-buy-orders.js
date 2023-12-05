import { useEffect, useState } from 'react';
import { normalizeString } from 'src/utils/format';
import secondaryMarket from "../../utils/secondary-market";
import {useAuth} from "../use-auth";
import {ethers} from "ethers";
import secondaryMarketAbi from "../../abis/secondary-market.json";

export function useBuyOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    secondaryMarket.listOrders().then(completeList => {
      const list = completeList.filter(order => order.seller === user.publicKey)

      setOrders(list);
    });
  }, []);

  const cancelOrder = async (order) => {
    const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
    console.info('Starting process to cancel order', { order, signer });

    const secondaryMarketContract = new ethers.Contract(process.env.NEXT_PUBLIC_SECONDARY_MARKET, secondaryMarketAbi, signer);
    const orderTx = await secondaryMarketContract.cancelListing(order.internalId);
    console.info('Order Cancel Processing...', orderTx)
    const orderRes = await orderTx.wait(1);
    console.info('Order Cancel Result', orderRes);
    if (orderRes.status) {
      window.location.reload();
      return orderRes;
    }

    throw Error('Falha no cancelamento do pedido.')
  };

  return {
    orders: orders.filter((order) => normalizeString(order.name).includes(normalizeString(search))),
    cancelOrder,
    search,
    setSearch,
    searchOpen,
    setSearchOpen
  };
}