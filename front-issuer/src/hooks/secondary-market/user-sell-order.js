import { useEffect, useMemo, useState } from 'react';
import { useSecondaryMarketContext } from 'src/contexts/secondary-martket-context';
import { useAuth } from '../use-auth';
import { useSDK } from '@metamask/sdk-react';
import { useTPF } from '../use-tpf';
import { useSnackbar } from 'notistack';
import BigNumber from 'bignumber.js';

export function useSellOrder() {
  const [options, setOptions] = useState([]);
  const [values, setValues] = useState({ asset: '', quantity: null, totalPrice: null });
  const { approve, createListing, waitTransaction } = useSecondaryMarketContext();

  const { enqueueSnackbar } = useSnackbar();
  const { tpfs, balanceOf } = useTPF();
  const { user } = useAuth();
  const { sdk } = useSDK();
  const [complements, setComplements] = useState([]);

  const getTPFs = async () => {
    console.log('getTPFs', tpfs);
    if (!tpfs.isLoading) {
      const tempOpt = tpfs.data.map((tpf) => ({
        value: tpf.symbol,
        id: tpf.contractAddress,
      }));
      const balances = [];
      const opts = await Promise.all(tempOpt.map(async (tpf) => {
        const balance = await balanceOf({ accountAddress: user.publicKey, contractAddress: tpf.id })
        if (balance > 0) {
          balances.push({ balance, id: tpf.id, decimals: tpfs.data.find(tpfData => tpfData.contractAddress === tpf.id)?.decimals });
          return {
            value: tpf.value,
            id: tpf.id,
          }
        }
      }));
      setOptions(opts.filter((opt) => opt !== undefined));
      setComplements(balances);
    }
  }

  useEffect(() => {
    getTPFs();
  }, []);

  useEffect(() => {
    getTPFs();
  }, [tpfs]);

  const totalAssets = useMemo(() => {
    return complements.find((balance) => balance.id === values.asset)?.balance ?? 0
  }, [values, complements]);

  const decimals = useMemo(() => {
    return complements.find((balance) => balance.id === values.asset)?.decimals ?? 0
  }, [values, complements]);

  const unitPrice = useMemo(() => {
    if (!values.quantity || !values.totalPrice) {
      return 0;
    }
    return (values.totalPrice / values.quantity).toFixed(2);
  }, [values]);

  const sellDisabled = useMemo(() => {
    return !values.asset || !values.quantity || !values.totalPrice;
  }, [values]);

  const [loading, setLoading] = useState(false);

  return {
    options,
    values,
    totalAssets,
    unitPrice,
    sellDisabled,
    loading,
    decimals,
    setValue: (key, val) => {
      const newValues = Object.assign({}, { ...values, [key]: val });
      setValues(newValues);
    },
    onClickSell: async () => {
      setLoading(true);
      console.log('onClickSell', {
        amount: new BigNumber(values.quantity).shiftedBy(decimals).toNumber(),
        from: user.publicKey,
        asset: values.asset,
        price: values.totalPrice,
        from: user.publicKey,
      });
      const amount = new BigNumber(values.quantity).shiftedBy(decimals).toNumber();
      try {
        const txAllowance = await approve({
          amount: amount,
          from: user.publicKey,
          asset: values.asset,
        })
        console.debug('approve tx: ', txAllowance);
        const txHash = await sdk.getProvider().request({
          method: 'eth_sendTransaction',
          params: [txAllowance]
        });
        enqueueSnackbar(`Aguarde a confirmação da transação de aprovação (${txHash})`, { variant: 'info' });
        await waitTransaction({ txHash });
      } catch (error) {
        console.error('approve error: ', error);
        enqueueSnackbar(`Erro para dar permissão para listar o ativo no book`, { variant: 'error' });
        setLoading(false);
        return;
      }

      try {
        const tx = await createListing({
          amount: amount,
          price: values.totalPrice,
          token: values.asset,
          from: user.publicKey,
        });
        console.debug('createListing tx: ', tx);
        const txHash = await sdk.getProvider().request({
          method: 'eth_sendTransaction',
          params: [tx]
        });
        enqueueSnackbar(`Transação de inserção do pedido de venda no book (${txHash})`, { variant: 'info' });
        await waitTransaction({ txHash });
      } catch (error) {
        console.error('createListing error: ', error);
        enqueueSnackbar(`Erro para listar o ativo no book`, { variant: 'error' });
        return;
      } finally {
        setLoading(false);
      }
    }
  };
}
