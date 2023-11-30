import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TextField,
  Stack,
  Dialog,
  DialogContent,
  DialogContentText,
  Slide,
  Icon,
  Typography,
  CircularProgress,
  Paper,
  SvgIcon
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSDK } from '@metamask/sdk-react';
import { useTPF } from 'src/hooks/use-tpf';
import { addDays, format } from 'date-fns';
import BigNumber from 'bignumber.js';
import { NumericFormat } from 'react-number-format';
import { useSnackbar } from 'notistack';
import { MetamaskButton } from 'src/components/metamask-button';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const CustomPaper = forwardRef(function CustomPaper(props, ref) {
  return <Paper ref={ref} style={{ borderRadius: 0, padding: '16px' }} {...props} />;
});

export const TPFBuy = (props) => {
  const { open, handleClose, tpf = {} } = props;

  const { enqueueSnackbar } = useSnackbar();

  const { sdk, connected, chainId, account } = useSDK();
  const { invest, getPrice, approve, waitTransaction, simulate: preview } = useTPF();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(10);
  const formik = useFormik({
    initialValues: {
      amount: 1000
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .min(tpf.minimumValue, `Valor informado deve ser maior que ${tpf.minimumValue}`)
        .required('Valor mínimo é obrigatório')
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
      console.log(accounts, chainId);
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
  const [simulated, setSimulated] = useState(false);
  const simulate = () => {
    const amount = new BigNumber(formik.values.amount).shiftedBy(tpf.decimals);
    preview({
      amount: amount.toNumber(),
      contractAddress: tpf.contractAddress,
      timestamp: Date.now() / 1000
    }).then((quantity) => {
      setLastSimulatedValue(new BigNumber(quantity).shiftedBy(-tpf.decimals));
      setSimulated(true);
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
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      PaperComponent={CustomPaper}
      maxWidth
    >
      <div style={{ fontSize: '20px', fontWeight: 600 }}>
        Compra de Título Público
        <Icon
          style={{ float: 'right', width: 40, height: 40, coloer: 'navy', cursor: 'pointer' }}
          onClick={handleClose}
        >
          <SvgIcon>
            <XMarkIcon />
          </SvgIcon>
        </Icon>
      </div>
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
              <span title={tpf.contractAddress} style={{ color: '#0076D6' }}>
                {tpf.contractAddress.substring(0, 22)}...
              </span>
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
            <p>
              <strong>Valor mínimo</strong>
              <br />
              <span>{tpf.minimumValue} BRLX</span>
            </p>
            {unitPrice && (
              <p>
                <strong>Preço Unitário</strong>
                <br />
                <span>{new BigNumber(unitPrice).shiftedBy(-tpf.decimals).toString()} BRLX</span>
              </p>
            )}
          </div>
        </DialogContentText>
        <form noValidate onSubmit={formik.handleSubmit} style={{ margin: '16px' }}>
          <Stack spacing={1}>
            <MetamaskButton connect={connect} connected={connected} account={account} />
            <b>Quanto deseja comprar?</b>
            <p>
              <b style={{ fontWeight: 600, fontSize: 14 }}>Valor</b>
              <NumericFormat
                error={!!(formik.touched.amount && formik.errors.amount)}
                fullWidth
                helperText={formik.touched.amount && formik.errors.amount}
                hiddenLabel
                name="amount"
                onBlur={formik.handleBlur}
                onChange={handleChangeAmount}
                value={formik.values.amount}
                decimalScale={tpf.decimals}
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
                  <strong>Você irá receber:</strong> {lastSimulatedValue.toFormat(tpf.decimals)}
                </DialogContentText>
                <Box sx={{ display: 'flex', mt: 3, justifyContent: 'center' }}>
                  <CircularProgress variant="determinate" value={submitProgress} />
                  Carregando...
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
                >
                  Simular
                </Button>
                {simulated && lastSimulatedValue && (
                  <p>
                    <b style={{ fontWeight: 600, fontSize: 14 }}>Você irá receber</b>{' '}
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
    </Dialog>
  );
};

TPFBuy.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  tpf: PropTypes.object
};
