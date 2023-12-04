import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Stack,
  Dialog,
  DialogContent,
  DialogContentText,
  Slide,
  Icon,
  Typography,
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
import { MetaMaskButton } from 'src/components/metamask-button';
import { AddressButton } from 'src/components/address-button';
import { shortenAddress } from 'src/utils/shorten-address';
import Link from 'next/link';
import { getContractLink } from 'src/utils/token-link';
import { useAuth } from 'src/hooks/use-auth';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const CustomPaper = forwardRef(function CustomPaper(props, ref) {
  return <Paper ref={ref} style={{ borderRadius: 0, padding: '16px' }} {...props} />;
});

export const TPFWithdraw = (props) => {
  const { open, handleClose, tpf = {} } = props;
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const { user } = useAuth();

  const min = useMemo(() => {
    if (!tpf?.decimals) return 1;
    return new BigNumber(1).shiftedBy(-tpf.decimals).toNumber();
  }, [tpf]);

  const { enqueueSnackbar } = useSnackbar();

  const { sdk, connected, account } = useSDK();
  const { balanceOfAsset, withdraw, broadcast } = useTPF();

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const formik = useFormik({
    initialValues: {
      amount: ''
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .min(min, 'Valor informado deve ser maior que ${min}')
        .max(balance, ({ max }) => {
          if (balance === 0) return `Valor informado deve ser ${max}`;
          return `Valor informado deve ser menor ou igual ${max}`;
        })
        .required('Valor deve ser informado')
    }),
    onSubmit: async (values) => {
      setIsLoadingSubmit(true);
      const amount = parseInt(new BigNumber(values.amount).shiftedBy(tpf.decimals).toNumber());
      console.info('started withdraw generate payload', {
        contractAddress: tpf.contractAddress,
        amount,
        destinationAddress: user.publicKey,
        from: user.publicKey,
      });
      const tx = await withdraw({
        contractAddress: tpf.contractAddress,
        amount,
        destinationAddress: user.publicKey,
        from: user.publicKey,
      }).catch((err) => {
        console.error(`failed to generate payload tx`, err);
        enqueueSnackbar(`Falha ao gerar os dados da transação`, {
          variant: 'error',
          autoHideDuration: 10000,
        });
        setIsLoadingSubmit(false);
        throw err;
      });

      console.info('start broadcast tx:', tx);
      const { txHash } = await broadcast(tx).catch((err) => {
        console.error(`failed to broadcast tx`, tx, err);
        enqueueSnackbar(`Falha ao enviar transação`, {
          variant: 'error',
          autoHideDuration: 10000,
        });
        setIsLoadingSubmit(false);
        throw err;
      });
      enqueueSnackbar(`Transação enviada com sucesso: ${txHash}`, {
        variant: 'success',
        autoHideDuration: 10000,
      });
      setIsLoadingSubmit(false);
    }
  });

  useEffect(() => {
    if (tpf?.asset && tpf.contractAddress && account) {
      setLoadingBalance(true)
      console.log('load balance', tpf.asset, tpf.contractAddress, account, user.publicKey);
      balanceOfAsset({
        accountAddress: user.publicKey,
        assetAddress: tpf.asset,
        contractAddress: tpf.contractAddress,
      }).then((currentBalance) => {
        setBalance(currentBalance);
      }).finally(() => {
        setLoadingBalance(false);
      })
    }
  }, [tpf, account]);

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

  const yieldPercent = useMemo(() => {
    if (!tpf?.yield) return '0.00';
    return (tpf.yield / 100).toFixed(2)
  }, [tpf]);

  const balancePreview = useMemo(() => {
    if (!tpf?.decimals || balance === 0) return '0.00';
    return new BigNumber(balance).shiftedBy(-tpf.decimals).toFormat(tpf.decimals)
  }, [balance, tpf])

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
                href={getContractLink(tpf.contractAddress)}
                target="_blank"
                title={tpf.contractAddress}
                style={{ color: '#0076D6', textDecoration: 'none' }}
              >
                {tpf.contractAddress?.substring(0, 22)}...
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
              <span>{yieldPercent}% a.a</span>
            </p>
          </div>
          <div style={{ border: '1px solid #F8DFE2', padding: '16px' }}>
            <p>
              <strong>Saldo Disponível</strong>
              <br />
              <span>{loadingBalance ? 'Carregando...' : balancePreview}</span>
            </p>
          </div>
        </DialogContentText>
        <hr style={{ height: 2, margin: '24px 0' }} />
        <form noValidate onSubmit={formik.handleSubmit} style={{ margin: '16px' }}>
          <Stack spacing={1}>
            {connected && account ? (
              <AddressButton>{shortenAddress(account, 16, 15)}</AddressButton>
            ) : (
              <MetaMaskButton onClick={connect} />
            )}
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
                onChange={formik.handleChange}
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
            <Button
              disabled={!connected || !account || isLoadingSubmit || loadingBalance}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              style={{ borderRadius: '50px' }}
            >
              Sacar
            </Button>
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
