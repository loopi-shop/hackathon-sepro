import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Stack, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useSDK } from '@metamask/sdk-react';
import { PageTitle } from 'src/components/page-title';
import { useMessage } from 'src/hooks/use-message';
import { MetaMaskButton } from 'src/components/metamask-button';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const { showDanger } = useMessage();
  const { sdk } = useSDK();

  const handleSkip = useCallback(() => {
    auth.skip().then(() => router.push('/'));
  }, [auth, router]);

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
            <MetaMaskButton onClick={connect} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '4px', mb: '4px' }}>
              <Typography
                color="text.secondary"
                variant="body2"
                style={{ fontSize: '14px', lineHeight: '20px' }}
              >
                Você precisa se conectar a rede Mumbai
              </Typography>
            </Box>
            <button
              className="br-button secondary"
              type="button"
              style={{ width: '100%', marginTop: '12px' }}
              onClick={handleSkip}
            >
              <span
                className="fas fa-city"
                style={{ width: '20px', height: '16px', marginRight: '8px' }}
              ></span>
              Entrar como Admin
            </button>
            <span className="br-divider my-4"></span>
            <Typography
              color="text.secondary"
              variant="body2"
              style={{ fontSize: '14px', lineHeight: '20px' }}
            >
              Ainda não tem conta?
            </Typography>
            <button
              className="br-button primary"
              type="button"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => router.push('/auth/register')}
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
