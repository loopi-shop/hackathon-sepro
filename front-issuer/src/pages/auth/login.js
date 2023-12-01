import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Stack, Icon, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useSDK } from '@metamask/sdk-react';
import { PageTitle } from 'src/components/page-title';
import { useMessage } from 'src/hooks/use-message';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const { showDanger } = useMessage();
  const { sdk, chainId } = useSDK();

  const handleSkip = useCallback(() => {
    auth.skip().then(() => router.push('/'));
  }, [auth, router]);

  const goToRegisterPage = useCallback(() => {
    router.push('/auth/register');
  }, [auth]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.info('Connected metamask accounts', accounts);

      const publicKey = accounts?.[0];

      await auth.signIn(`${publicKey}@loopipay.com`, `pass${publicKey}`).catch((error) => {
        console.error('Fail on Login', error);

        const errorMessage = ['auth/invalid-email', 'auth/invalid-login-credentials'].includes(
          error.code
        )
          ? 'Usuário não encontrado'
          : 'Erro desconhecido';

        showDanger(errorMessage);

        throw error;
      });

      router.push('/');
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  return (
    <>
      <PageTitle>Entrar</PageTitle>
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
            maxWidth: 420,
            p: 5,
            width: '100%',
            boxShadow: '0px 9px 6px 0px #33333333'
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4" style={{ fontSize: '20px', lineHeight: '28px' }}>
                Entre ou Registre-se
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
                style={{ fontSize: '14px', lineHeight: '20px' }}
              >
                Escolha uma das opções abaixo
              </Typography>
            </Stack>
            <button
              class="br-button secondary"
              type="button"
              style={{ width: '100%' }}
              onClick={connect}
            >
              <Icon sx={{ mr: 2, width: '20px', height: '20px' }}>
                <img alt={'Logo metamask'} src={'/assets/logos/logo-metamask.svg'} />
              </Icon>
              Conectar com MetaMask
            </button>
            <button
              class="br-button secondary"
              type="button"
              style={{ width: '100%', marginTop: '12px' }}
              onClick={handleSkip}
            >
              <span
                class="fas fa-city"
                style={{ width: '20px', height: '16px', marginRight: '8px' }}
              ></span>
              Entrar como Admin
            </button>
            <span class="br-divider my-4"></span>
            <Typography
              color="text.secondary"
              variant="body2"
              style={{ fontSize: '14px', lineHeight: '20px' }}
            >
              Ainda não tem conta?
            </Typography>
            <button
              class="br-button primary"
              type="button"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={goToRegisterPage}
            >
              Criar conta
            </button>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
