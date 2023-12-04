import { useEffect, useState } from 'react';

export function useBuyOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

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
      }
    ]);
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
