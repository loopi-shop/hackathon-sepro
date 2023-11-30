import { useCallback, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useSDK } from "@metamask/sdk-react";
import { PageTitle } from "src/components/page-title";
import { MetamaskButton } from "src/components/metamask-button";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [account, setAccount] = useState("");
  const [errors, setErrors] = useState([]);
  const { sdk, connected, chainId } = useSDK();

  const handleSkip = useCallback(() => {
    auth.skip().then(() => router.push("/"));
  }, [auth, router]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log(accounts, chainId);
      setAccount(accounts?.[0]);

      const publicKey = accounts?.[0];
      await auth.signIn(`${publicKey}@loopipay.com`, `pass${publicKey}`).catch((error) => {
        console.error("Fail on Login", error);
        console.log(JSON.stringify(error));

        const errorMessage = ["auth/invalid-email", "auth/invalid-login-credentials"].includes(
          error.code
        )
          ? "User Not found"
          : error;

        setErrors([errorMessage]);
        throw error;
      });
      router.push("/");
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  return (
    <>
      <PageTitle>Entrar</PageTitle>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Entrar</Typography>
              <Typography color="text.secondary" variant="body2">
                Não tem uma conta? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Registrar
                </Link>
              </Typography>
            </Stack>
            <MetamaskButton connect={connect} connected={connected} account={account} />
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {errors[0]?.toString()}
            </Typography>
            <Button fullWidth size="large" sx={{ mt: 3 }} onClick={handleSkip}>
              Entrar como admin
            </Button>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
