import { useEffect, useState } from 'react';

export function useSellOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders([
      {
        name: 'Symbol01',
        expirationDate: '30/11/2023',
        yield: '20',
        unitPrice: '1200',
        quantity: 2,
        totalPrice: '2400',
        sellPrice: '2350'
      },
      {
        name: 'Symbol02',
        expirationDate: '30/11/2023',
        yield: '20',
        unitPrice: '1200',
        quantity: 2,
        totalPrice: '2400',
        sellPrice: '2350'
      },
      {
        name: 'Symbol03',
        expirationDate: '30/11/2023',
        yield: '20',
        unitPrice: '1200',
        quantity: 2,
        totalPrice: '2400',
        sellPrice: '2350'
      }
    ]);
  }, []);

  const createOrder = (order) => {
    //TODO
    console.log("UNIMPLEMENTED")
  };

  return { orders, createOrder };
}
