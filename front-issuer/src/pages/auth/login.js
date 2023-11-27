import { useCallback, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Icon, Link, Stack, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useSDK } from '@metamask/sdk-react';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [account, setAccount] = useState('');
  const [errors, setErrors] = useState([]);
  const { sdk, connected, chainId } = useSDK();

  const handleSkip = useCallback(
    () => {
      auth.skip()
          .then(() => router.push('/'));
    },
    [auth, router]
  );

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log(accounts, chainId);
      setAccount(accounts?.[0]);

      const publicKey = accounts?.[0];
      await auth.signIn(`${publicKey}@loopipay.com`, `pass${publicKey}`)
        .catch(error => {
          console.error('Fail on Login', error);
          console.log(JSON.stringify(error))

          const errorMessage = ['auth/invalid-email','auth/invalid-login-credentials'].includes(error.code)
            ? 'User Not found'
            : error;

          setErrors([errorMessage]);
          throw error;
        });
        router.push('/');
    } catch(err) {
      console.warn(`failed to connect..`, err);
    }
  };

  return (
    <>
      <Head>
        <title>
          Login | Devias Kit
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
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
                Login
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
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
            <Typography
                color="error"
                sx={{ mt: 3 }}
                variant="body2"
            >
              {errors[0]?.toString()}
            </Typography>
            <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                onClick={handleSkip}
            >
              Login as admin
            </Button>
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