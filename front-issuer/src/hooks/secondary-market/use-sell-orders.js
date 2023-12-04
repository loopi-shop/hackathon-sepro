import { useEffect, useState } from 'react';
import secondaryMarket from "../../utils/secondary-market";
import {useAuth} from "../use-auth";

export function useSellOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    secondaryMarket.listOrders().then(completeList => {
      const list = completeList.filter(order => order.seller !== user.publicKey);

      setOrders(list);
    });
  }, []);

  const createOrder = (order) => {
    //TODO
    console.log("UNIMPLEMENTED")
  };

  return { orders, createOrder };
}