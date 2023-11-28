import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Stack, Dialog, DialogContent, DialogContentText, DialogTitle, Slide, Icon, Skeleton, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSDK } from "@metamask/sdk-react";
import { useTPF } from 'src/hooks/use-tpf';
import { addDays, format } from 'date-fns';
import BigNumber from 'bignumber.js';
import { NumericFormat } from 'react-number-format';

const Transition = forwardRef(function Transition(
  props,
  ref
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const TPFBuy = (props) => {
  const {
    open,
    handleClose,
    tpf = {}
  } = props;

  const { sdk, connected, chainId, account } = useSDK();
  const { invest, getPrice, approve, waitTransaction } = useTPF();
  const formik = useFormik({
    initialValues: {
      amount: 1000,
    },
    validationSchema: Yup.object({
      amount: Yup
        .number()
        .min(tpf.minimumValue)
        .required('Valor mínimo é obrigatório'),
    }),
    onSubmit: async (values) => {
      const amount = parseInt(new BigNumber(values.amount).shiftedBy(tpf.decimals).toNumber());
      const txAllowance = await approve({
        amount,
        from: account,
        contractAddress: tpf.contractAddress,
        asset: tpf.asset,
      })
      const txHash = await sdk.getProvider().request({
        method: 'eth_sendTransaction',
        params: [txAllowance]
      })
        .catch((error) => console.error(`eth_sendTransaction:approve:Error: `, error))
      console.info(`eth_sendTransaction:approve `, txHash);
      await waitTransaction({ txHash });

      const tx = await invest({
        amount,
        receiver: account,
        contractAddress: tpf.contractAddress,
        timestamp: Date.now() / 1000,
      });
      console.debug(`tx:`, tx);
      await sdk.getProvider().request({
        method: 'eth_sendTransaction',
        params: [tx]
      })
        .then((v) => console.info(`eth_sendTransaction:deposit `, v))
        .catch((error) => console.error(`eth_sendTransaction:deposit:Error: `, error))
    }
  });

  useEffect(() => {
    if (tpf?.minimumValue) formik.setValues({ amount: tpf.minimumValue });
  }, [tpf]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log(accounts, chainId);
    } catch (err) {
      console.error(`failed to connect..`, err);
    }
  };

  useEffect(() => {
    if (!connected) connect();
  }, [connected])

  const getExpirationDate = () => {
    if (tpf?.startTimestamp) {
      const expirationDate = addDays(tpf.startTimestamp, tpf.durationDays);
      return format(expirationDate, 'dd/MM/yyyy');
    }
  }

  const [unitPrice, setUnitPrice] = useState(null);
  useEffect(() => {
    if (open && tpf?.contractAddress) {
      getPrice({
        contractAddress: tpf.contractAddress,
        timestamp: Date.now() / 1000
      }).then((price) => {
        setUnitPrice(price);
      })
      const timer = setInterval(async () => {
        console.info(`price:refreshed`)
        const price = await getPrice({
          contractAddress: tpf.contractAddress,
          timestamp: Date.now() / 1000
        });
        setUnitPrice(price);
      }, 10_000);

      return () => {
        console.info(`price:refresh:stopped`)
        clearInterval(timer);
      }
    }
  }, [open, tpf])

  const [lastSimulatedValue, setLastSimulatedValue] = useState(new BigNumber(0));
  const [simulated, setSimulated] = useState(false)
  const simulate = () => {
    if (unitPrice) {
      const price = new BigNumber(unitPrice).shiftedBy(-tpf.decimals);
      const amount = new BigNumber(formik.values.amount);
      const quantity = amount.dividedBy(price);
      setLastSimulatedValue(quantity)
    }
    setSimulated(true);
  }

  const clearSimulated = () => {
    if (simulated) setSimulated(false);
  }

  const handleChangeAmount = (e) => {
    clearSimulated();
    formik.handleChange(e);
  }

  useEffect(() => {
    if (simulated) simulate();
  }, [unitPrice]);

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle textAlign="center">Compra de Título Público</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <strong>Símbolo:</strong> {tpf.symbol}<br />
          <strong>Nome:</strong> {tpf.name}<br />
          <strong>Endereço do Contrato:</strong> {tpf.contractAddress}<br />
          <strong>Data de Vencimento:</strong> {getExpirationDate()}<br />
          <strong>Rentabilidade:</strong> {(tpf.yield / 100).toFixed(2)}%<br />
          <strong>Valor Mínimo:</strong> {tpf.minimumValue}<br />
          {
            unitPrice &&
            (<><strong>Preço Unitário:</strong> {new BigNumber(unitPrice).shiftedBy(-tpf.decimals).toString()}<br /></>)
          }
        </DialogContentText>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={3}>
            <NumericFormat
              error={!!(formik.touched.amount && formik.errors.amount)}
              fullWidth
              helperText={formik.touched.amount && formik.errors.amount}
              label="Valor"
              name="amount"
              sx={{ mt: 2 }}
              onBlur={formik.handleBlur}
              onChange={handleChangeAmount}
              value={formik.values.amount}
              decimalScale={tpf.decimals}
              fixedDecimalScale
              customInput={TextField}
            />
            <Button
              fullWidth
              size="large"
              onClick={connect}
            >
              <Icon sx={{ mr: 2, width: '40px', height: '40px' }}>
                <img alt={'Logo metamask'} src={'/assets/logos/logo-metamask.svg'} />
              </Icon>
              {connected && account ? `Connected as: ${account}` : 'Connect With Metamask'}
            </Button>
          </Stack>
          {formik.errors.submit && (
            <Typography
              color="error"
              sx={{ mt: 3 }}
              variant="body2"
            >
              {formik.errors.submit}
            </Typography>
          )}
          <Button
            disabled={unitPrice === null || unitPrice === undefined}
            fullWidth
            size="large"
            sx={{ mt: 1 }}
            type="button"
            variant="contained"
            color="secondary"
            onClick={simulate}
          >
            Simular
          </Button>
          {
            !simulated ? <Skeleton animation="wave" variant="text" sx={{ mt: 1 }} />
              : <DialogContentText sx={{ mt: 1 }} textAlign="center">
                <strong>Quantidade a receber:</strong> {lastSimulatedValue.toFormat(tpf.decimals)}
              </DialogContentText>
          }
          <Button
            disabled={!connected || !account || !simulated}
            fullWidth
            size="large"
            sx={{ mt: 1 }}
            type="submit"
            variant="contained"
          >
            Comprar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
};

TPFBuy.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  tpf: PropTypes.object,
};

