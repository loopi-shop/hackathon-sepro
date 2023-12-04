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
import Link from 'next/link';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const CustomPaper = forwardRef(function CustomPaper(props, ref) {
  return <Paper ref={ref} style={{ borderRadius: 0, padding: '16px' }} {...props} />;
});

export const TPFWithdraw = (props) => {
  const { open, handleClose, tpf = {} } = props;
  const balance = 0;
  const min = 0.000001;

  const { enqueueSnackbar } = useSnackbar();

  const { sdk, connected, account } = useSDK();
  const { balanceOfAsset, withdraw } = useTPF();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const formik = useFormik({
    initialValues: {
      amount: 1000
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .min(min, 'Valor informado deve ser maior que ${min}')
        .max(balance, 'Valor informado deve ser menor ou igual ${max}')
        .required('Valor deve ser informado')
    }),
    onSubmit: async (values) => {
      setIsLoadingSubmit(true);
      const amount = parseInt(new BigNumber(values.amount).shiftedBy(tpf.decimals).toNumber());
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

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      PaperComponent={CustomPaper}
      maxWidth
    >
      <div style={{ fontSize: '20px', fontWeight: 600 }}>
        Saque de Título Público
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
              <Link
                href={`https://polygonscan.com/address/${tpf.contractAddress}`}
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
          </div>
        </DialogContentText>
        <hr style={{ height: 2, margin: '24px 0' }} />
        <form noValidate onSubmit={formik.handleSubmit} style={{ margin: '16px' }}>
          <Stack spacing={1}>
            <MetamaskButton connect={connect} connected={connected} account={account} />
            <b>Quanto deseja sacar?</b>
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
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

TPFWithdraw.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  tpf: PropTypes.object
};
