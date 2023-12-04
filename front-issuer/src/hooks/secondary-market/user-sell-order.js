import { useEffect, useMemo, useState } from 'react';
import { useSecondaryMarketContext } from 'src/contexts/secondary-martket-context';
import { useAuth } from '../use-auth';
import { useSDK } from '@metamask/sdk-react';
import { useTPF } from '../use-tpf';

export function useSellOrder() {
  const [options, setOptions] = useState([]);
  const [values, setValues] = useState({ asset: '', quantity: 2, totalPrice: 2000 });
  const { approve, createListing, waitTransaction } = useSecondaryMarketContext();
  const { tpfs, balanceOf } = useTPF();
  const { user } = useAuth();
  const { sdk } = useSDK();

  const getTPFs = async () => {
    console.log('getTPFs', tpfs);
    if (!tpfs.isLoading) {
      const tempOpt = tpfs.data.map((tpf) => ({
        value: tpf.symbol,
        id: tpf.contractAddress,
      }));
      const opts = await Promise.all(tempOpt.map(async (tpf) => {
        console.log('tpf: ', tpf)
        const balance = await balanceOf({ accountAddress: user.publicKey, contractAddress: tpf.id })
        if (balance > 0) {
          return {
            value: tpf.value,
            id: tpf.id,
          }
        }
      }));
      console.log('options: ', opts.filter((opt) => opt !== undefined))
      setOptions(opts.filter((opt) => opt !== undefined));
    }
  }

  useEffect(() => {
    getTPFs();
  }, []);

  useEffect(() => {
    getTPFs();
  }, [tpfs]);

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
    onClickSell: async () => {
      console.log('onClickSell', {
        amount: values.quantity,
        from: user.publicKey,
        asset: values.asset,
        price: values.totalPrice,
        from: user.publicKey,
      })
      try {
        const txAllowance = await approve({
          amount: values.quantity,
          from: user.publicKey,
          asset: values.asset,
        })
        console.debug('approve tx: ', txAllowance);
        const txHash = await sdk.getProvider().request({
          method: 'eth_sendTransaction',
          params: [txAllowance]
        });
        await waitTransaction({ txHash });
      } catch (error) {
        console.error('approve error: ', error);
        return;
      }

      try {
        const tx = await createListing({
          amount: values.quantity,
          price: values.totalPrice,
          token: values.asset,
          from: user.publicKey,
        });
        console.debug('createListing tx: ', tx);
        const txHash = await sdk.getProvider().request({
          method: 'eth_sendTransaction',
          params: [tx]
        });
        await waitTransaction({ txHash });
      } catch (error) {
        console.error('createListing error: ', error);
        return;
      }
    }
  };
}
