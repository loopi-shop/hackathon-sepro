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
import { MetaMaskProvider } from '@metamask/sdk-react';
import 'simplebar-react/dist/simplebar.min.css';

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();
  console.log(typeof window !== "undefined" && window);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Devias Kit
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MetaMaskProvider debug={false} sdkOptions={{
          checkInstallationImmediately: false,
          dappMetadata: {
            name: "Hackaton Sepro",
            url: typeof window !== "undefined" ? window.location.host : 'http://localhost:3000',
          }
        }}>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthConsumer>
                {
                  (auth) => auth.isLoading
                    ? <SplashScreen />
                    : getLayout(<Component {...pageProps} />)
                }
              </AuthConsumer>
            </ThemeProvider>
          </AuthProvider>
        </MetaMaskProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;