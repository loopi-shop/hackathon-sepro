import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Stack, Dialog, DialogContent, DialogContentText, DialogTitle, Slide, Icon } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSDK } from "@metamask/sdk-react";

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

  const { connected } = useSDK();
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
    onSubmit: async (values, helpers) => {
      // call
      // tpf - invest
      // metamask - sendTransaction
    }
  });

  useEffect(() => {
    if (tpf?.minimumValue) formik.setValues({ amount: tpf.minimumValue });
  }, tpf);

  const [account, setAccount] = useState('');
  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log(accounts, chainId);
      setAccount(accounts?.[0]);
    } catch (err) {
      console.error(`failed to connect..`, err);
    }
  };

  useEffect(() => {
    if (!connected) connect();
  }, [connected])

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Compra de Título Público</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p><strong>Símbolo:</strong> {tpf.symbol}</p>
          <p><strong>Nome:</strong> {tpf.name}</p>
          <p><strong>Rentabilidade:</strong> {(tpf.yield / 100).toFixed(2)}%</p>
          <p><strong>Valor Mínimo</strong>: {tpf.minimumValue}</p>
        </DialogContentText>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={3}>
            <TextField
              error={!!(formik.touched.amount && formik.errors.amount)}
              fullWidth
              helperText={formik.touched.amount && formik.errors.amount}
              label="Valor"
              name="amount"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.amount}
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
            disabled={!connected || !account}
            fullWidth
            size="large"
            sx={{ mt: 3 }}
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

