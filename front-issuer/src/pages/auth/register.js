import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { PageTitle } from "src/components/page-title";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [account, setAccount] = useState("");
  const { sdk, connected, chainId } = useSDK();

  const formik = useFormik({
    initialValues: {
      name: "Demo",
      country: "Brasil",
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255, "Máximo de 255 caracteres").required("Nome é obrigatório"),
      country: Yup.string().max(255, "Máximo de 255 caracteres").required("País é obrigatório"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const { name, country } = values;
        const publicKey = account;
        await auth.signUp(`${publicKey}@loopipay.com`, `pass${publicKey}`, {
          name,
          country,
          publicKey,
        });
        router.push("/");
      } catch (err) {
        const errorMessage = ["auth/email-already-in-use"].includes(err.code)
          ? "Já existe um usuário com a chave pública fornecida"
          : err.message;

        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: errorMessage });
        helpers.setSubmitting(false);
      }
    },
  });

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log(accounts, chainId);
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn(`Falha ao conectar...`, err);
    }
  };

  return (
    <>
      <PageTitle>Registro</PageTitle>
      <Box
        sx={{
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
              <Typography variant="h4">Registrar</Typography>
              <Typography color="text.secondary" variant="body2">
                Já tem uma conta? &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                  Entrar
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nome"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.country && formik.errors.country)}
                  fullWidth
                  helperText={formik.touched.country && formik.errors.country}
                  label="País"
                  name="country"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.country}
                />
                <MetamaskButton connect={connect} connected={connected} account={account} />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
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
                Continuar
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
