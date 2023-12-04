import { useEffect, useState } from 'react';
import secondaryMarket from "../../utils/secondary-market";
import {useAuth} from "../use-auth";

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

  const removeOrder = (order) => {
    //TODO
    console.log('UNIMPLEMENTED');
  };

  return {
    orders: orders.filter((order) => order.name.includes(search)),
    removeOrder,
    search,
    setSearch,
    searchOpen,
    setSearchOpen
  };
}