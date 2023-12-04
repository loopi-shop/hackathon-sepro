import { useEffect, useMemo, useState } from 'react';

export function useSellOrder() {
  const [options, setOptions] = useState([]);
  const [values, setValues] = useState({ asset: '', quantity: 2, totalPrice: 2000 });

  useEffect(() => {
    setOptions([
      { value: 'Symbol01', id: 1 },
      { value: 'Symbol02', id: 2 }
    ]);
  }, []);

  const totalAssets = useMemo(() => {
    if (!values.asset) {
      return 0;
    }
    //TODO
    return 4;
  }, [values]);
  const unitPrice = useMemo(() => {
    if (!values.quantity || !values.totalPrice) {
      return 0;
    }
    return (values.totalPrice / values.quantity).toFixed(2);
  }, [values]);

  const sellDisabled = useMemo(() => {
    return !values.asset || !values.quantity || !values.totalPrice;
  }, [values]);

  return {
    options,
    values,
    totalAssets,
    unitPrice,
    sellDisabled,
    setValue: (key, val) => {
      const newValues = Object.assign({}, { ...values, [key]: val });
      setValues(newValues);
    },
    onClickSell: () => {
      //TODO
    }
  };
}
