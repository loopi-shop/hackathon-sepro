import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Box, Button, Icon, Link, Stack, TextField, Typography} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import {useState} from "react";
import {useSDK} from "@metamask/sdk-react";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [account, setAccount] = useState('');
  const { sdk, connected, chainId } = useSDK();

  const formik = useFormik({
    initialValues: {
      name: 'Demo',
      country: 'Brasil',
      submit: null
    },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      country: Yup
          .string()
          .max(255)
          .required('Country is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const { name, country } = values;
        const publicKey = account;
        await auth.signUp(`${publicKey}@loopipay.com`, `pass${publicKey}`,{ name, country, publicKey });
        router.push('/');
      } catch (err) {
        const errorMessage = ['auth/email-already-in-use'].includes(err.code)
            ? 'User with public key already exists'
            : err.message;

        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: errorMessage });
        helpers.setSubmitting(false);
      }
    }
  });

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log(accounts, chainId);
      setAccount(accounts?.[0]);
    } catch(err) {
      console.warn(`failed to connect..`, err);
    }
  };

  return (
    <>
      <Head>
        <title>
          Register | Devias Kit
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Register
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                    error={!!(formik.touched.country && formik.errors.country)}
                    fullWidth
                    helperText={formik.touched.country && formik.errors.country}
                    label="Country"
                    name="country"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.country}
                />
                <Button
                    fullWidth
                    size="large"
                    onClick={connect}
                >
                  <Icon sx={{mr: 2, width: '40px', height: '40px'}}>
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
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;