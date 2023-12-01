import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context';
import { useNProgress } from 'src/hooks/use-nprogress';
import { createTheme } from 'src/theme';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import { TPFProvider } from 'src/contexts/tpf-context';
import { MetaMaskProvider } from '@metamask/sdk-react';
import 'simplebar-react/dist/simplebar.min.css';
import { SnackbarProvider } from 'notistack';
import { Message } from 'src/components/message';
import '@govbr-ds/core/dist/core.min.css';

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Título Público Federal</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={10}
          Components={{
            success: Message,
            info: Message,
            warning: Message,
            danger: Message
          }}
        >
          <MetaMaskProvider
            debug={false}
            sdkOptions={{
              checkInstallationImmediately: false,
              dappMetadata: {
                name: 'Hackaton Serpro',
                url: typeof window !== 'undefined' ? window.location.host : 'http://localhost:3000'
              }
            }}
          >
            <AuthProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <TPFProvider>
                  <AuthConsumer>
                    {(auth) =>
                      auth.isLoading ? <SplashScreen /> : getLayout(<Component {...pageProps} />)
                    }
                  </AuthConsumer>
                </TPFProvider>
              </ThemeProvider>
            </AuthProvider>
          </MetaMaskProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
