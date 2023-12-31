import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TextField,
  Stack,
  DialogContent,
  DialogContentText,
  Typography,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSDK } from '@metamask/sdk-react';
import { useTPF } from 'src/hooks/use-tpf';
import { addDays, format } from 'date-fns';
import BigNumber from 'bignumber.js';
import { NumericFormat } from 'react-number-format';
import { useSnackbar } from 'notistack';
import { MetaMaskButton } from 'src/components/metamask-button';
import { AddressButton } from 'src/components/address-button';
import { shortenAddress } from 'src/utils/shorten-address';
import Link from 'next/link';
import { getContractLink } from 'src/utils/token-link';
import { CustomDialog } from 'src/components/dialog';
import { formatBRLX } from 'src/utils/format';
import { BRLX_DECIMALS } from 'src/constants';

export const TPFBuy = (props) => {
  const { open, handleClose, tpf = {} } = props;

  const { enqueueSnackbar } = useSnackbar();

  const { sdk, connected, account } = useSDK();
  const { invest, getPrice, approve, waitTransaction, simulate: preview } = useTPF();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(10);
  const formik = useFormik({
    initialValues: {
      amount: 1000
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .min(0, `Informe algum valor`)
        .required('Informe a quantidade que deseja comprar')
    }),
    onSubmit: async (values) => {
      setIsLoadingSubmit(true);
      const amount = parseInt(new BigNumber(values.amount).shiftedBy(tpf.decimals).toNumber());
      try {
        const txAllowance = await approve({
          amount,
          from: account,
          contractAddress: tpf.contractAddress,
          asset: tpf.asset
        });
        setSubmitProgress(20);
        const txHash = await sdk.getProvider().request({
          method: 'eth_sendTransaction',
          params: [txAllowance]
        });
        setSubmitProgress(40);
        console.info(`eth_sendTransaction:approve `, txHash);
        enqueueSnackbar(`Aguardando a confirmação da transação ${txHash}`, {
          variant: 'info',
          autoHideDuration: 10000
        });
        await waitTransaction({ txHash });
        setSubmitProgress(50);
      } catch (error) {
        console.error(`approve:`, error);
        enqueueSnackbar(
          `Erro para aprovar a transferencia de token do contrato ${tpf.contractAddress} para o contrato ${tpf.asset}`,
          {
            variant: 'error'
          }
        );
        setIsLoadingSubmit(false);
        return;
      }

      try {
        const tx = await invest({
          amount,
          receiver: account,
          contractAddress: tpf.contractAddress,
          timestamp: Date.now() / 1000
        });
        setSubmitProgress(75);
        console.debug(`tx:`, tx);
        const txHash = await sdk.getProvider().request({
          method: 'eth_sendTransaction',
          params: [tx]
        });
        setSubmitProgress(100);
        enqueueSnackbar(`Transação de investimento: ${txHash}`, {
          variant: 'info',
          autoHideDuration: 10000
        });
      } catch (error) {
        console.error(`deposit:`, error);
        enqueueSnackbar(`Erro para concretizar o investimento no contrato ${tpf.contractAddress}`, {
          variant: 'error'
        });
      }
      setIsLoadingSubmit(false);
    }
  });

  useEffect(() => {
    if (tpf?.minimumValue) formik.setValues({ amount: tpf.minimumValue });
  }, [tpf]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.info('Connected metamask accounts', accounts);
    } catch (err) {
      console.error(`failed to connect..`, err);
    }
  };

  useEffect(() => {
    if (!connected) connect();
  }, [connected]);

  const getExpirationDate = () => {
    if (tpf?.startTimestamp) {
      const expirationDate = addDays(tpf.startTimestamp, tpf.durationDays);
      return format(expirationDate, 'dd/MM/yyyy');
    }
  };

  const [unitPrice, setUnitPrice] = useState(null);
  useEffect(() => {
    if (open && tpf?.contractAddress) {
      getPrice({
        contractAddress: tpf.contractAddress,
        timestamp: Date.now() / 1000
      }).then((price) => {
        setUnitPrice(price);
      });
      const timer = setInterval(async () => {
        console.info(`price:refreshed`);
        const price = await getPrice({
          contractAddress: tpf.contractAddress,
          timestamp: Date.now() / 1000
        });
        setUnitPrice(price);
      }, 10_000);

      return () => {
        console.info(`price:refresh:stopped`);
        clearInterval(timer);
      };
    }
  }, [open, tpf]);

  const [lastSimulatedValue, setLastSimulatedValue] = useState(new BigNumber(0));
  const [isLoadingSimulation, setIsLoadingSimulation] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const simulate = () => {
    setIsLoadingSimulation(true);
    const amount = new BigNumber(formik.values.amount).shiftedBy(tpf.decimals);
    preview({
      amount: amount.toNumber(),
      contractAddress: tpf.contractAddress,
      timestamp: Date.now() / 1000
    })
      .then((quantity) => {
        setLastSimulatedValue(new BigNumber(quantity).shiftedBy(-tpf.decimals));
        setSimulated(true);
      })
      .finally(() => {
        setIsLoadingSimulation(false);
      });
  };

  const clearSimulated = () => {
    if (simulated) setSimulated(false);
  };

  const handleChangeAmount = (e) => {
    clearSimulated();
    formik.handleChange(e);
  };

  useEffect(() => {
    if (simulated) simulate();
  }, [unitPrice]);

  return (
    <CustomDialog title="Compra de Título Público" open={open} handleClose={handleClose}>
      <DialogContent style={{ margin: 0, padding: 0 }}>
        <DialogContentText
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            margin: 0,
            padding: 0
          }}
        >
          <div style={{ border: '1px solid #F8DFE2', padding: '16px' }}>
            <p>
              <strong>Símbolo</strong>
              <br />
              <span>{tpf.symbol}</span>
            </p>
            <p>
              <strong>Nome</strong>
              <br />
              <span>{tpf.name}</span>
            </p>
            <p>
              <strong>Endereço do contrato</strong>
              <br />
              <Link
                href={getContractLink(tpf.contractAddress)}
                target="_blank"
                title={tpf.contractAddress}
                style={{ color: '#0076D6', textDecoration: 'none' }}
              >
                {tpf.contractAddress.substring(0, 22)}...
              </Link>
            </p>
          </div>
          <div style={{ border: '1px solid #F8DFE2', padding: '16px' }}>
            <p>
              <strong>Data de vencimento</strong>
              <br />
              <span>{getExpirationDate()}</span>
            </p>
            <p>
              <strong>Rentabilidade</strong>
              <br />
              <span>{(tpf.yield / 100).toFixed(2)}% a.a</span>
            </p>
            {unitPrice && (
              <p>
                <strong>Preço Unitário</strong>
                <br />
                <span>
                  {formatBRLX(new BigNumber(unitPrice).shiftedBy(-tpf.decimals).toString())} BRLX
                </span>
              </p>
            )}
          </div>
        </DialogContentText>
        <hr style={{ height: 2, margin: '24px 0' }} />
        <form noValidate onSubmit={formik.handleSubmit} style={{ margin: '16px' }}>
          <Stack spacing={1}>
            {connected ? (
              <AddressButton>{shortenAddress(account, 16, 15)}</AddressButton>
            ) : (
              <MetaMaskButton onClick={connect} />
            )}
            <b>Quanto deseja comprar?</b>
            <p>
              <b style={{ fontWeight: 600, fontSize: 14 }}>Valor (BRLX)</b>
              <NumericFormat
                error={!!(formik.touched.amount && formik.errors.amount)}
                fullWidth
                helperText={formik.touched.amount && formik.errors.amount}
                hiddenLabel
                name="amount"
                onBlur={formik.handleBlur}
                onChange={handleChangeAmount}
                value={formik.values.amount}
                decimalScale={BRLX_DECIMALS}
                fixedDecimalScale
                customInput={TextField}
              />
            </p>
            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
            {isLoadingSubmit ? (
              <>
                <DialogContentText sx={{ mt: 1 }} textAlign="center">
                  <strong>Você irá receber:</strong> {lastSimulatedValue.toFormat(tpf.decimals)} (
                  {tpf.symbol})
                </DialogContentText>
                <Box sx={{ display: 'flex', mt: 3, justifyContent: 'center' }}>
                  <CircularProgress size={24} value={submitProgress} sx={{ mr: 1 }} /> Carregando...
                </Box>
              </>
            ) : (
              <>
                <Button
                  disabled={unitPrice === null || unitPrice === undefined}
                  fullWidth
                  size="large"
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={simulate}
                  style={{ borderRadius: '50px' }}
                  startIcon={
                    isLoadingSimulation && (
                      <CircularProgress size={24} value={submitProgress} sx={{ mr: 1 }} />
                    )
                  }
                >
                  Simular
                </Button>
                {simulated && lastSimulatedValue && (
                  <p>
                    <b style={{ fontWeight: 600, fontSize: 14 }}>Você irá receber ({tpf.symbol})</b>
                    <NumericFormat
                      fullWidth
                      hiddenLabel
                      value={lastSimulatedValue.toFormat(tpf.decimals)}
                      decimalScale={tpf.decimals}
                      fixedDecimalScale
                      customInput={TextField}
                      readOnly
                    />
                  </p>
                )}
                <Button
                  disabled={!connected || !account || !simulated}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  style={{ borderRadius: '50px' }}
                >
                  Comprar
                </Button>
              </>
            )}
          </Stack>
        </form>
      </DialogContent>
    </CustomDialog>
  );
};

TPFBuy.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  tpf: PropTypes.object
};
