import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Stack, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useSDK } from '@metamask/sdk-react';
import { PageTitle } from 'src/components/page-title';
import { Input } from 'src/components/input';
import { Select } from 'src/components/select';
import { MetaMaskButton } from 'src/components/metamask-button';
import { AddressButton } from 'src/components/address-button';
import { shortenAddress } from 'src/utils/shorten-address';
import { useMessage } from 'src/hooks/use-message';
import COUNTRY_LIST from 'src/components/country-list.json';

const COUNTRIES = COUNTRY_LIST.map((country) => ({
  id: country.code,
  value: country.name
}));

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const { sdk, connected, account } = useSDK();
  const { showDanger } = useMessage();

  const formik = useFormik({
    initialValues: {
      name: '',
      country: '76' /* Brasil */,
      taxId: '',
      submit: null
    },
    validationSchema: Yup.object({
      name: Yup.string().max(100, 'Máximo de 100 caracteres').required('Nome é obrigatório'),
      country: Yup.string().max(100, 'Máximo de 100 caracteres').required('País é obrigatório'),
      taxId: Yup.string().max(50, 'Máximo de 50 caracteres').required('Documento é obrigatório')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const { name, country, taxId } = values;
        const publicKey = account;

        await auth.signUp(`${publicKey}@loopipay.com`, `pass${publicKey}`, {
          name,
          country,
          taxId,
          publicKey
        });

        router.push('/');
      } catch (err) {
        const errorMessage = ['auth/email-already-in-use'].includes(err.code)
          ? 'Já existe um usuário com a chave pública fornecida'
          : err.message;

        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: errorMessage });
        helpers.setSubmitting(false);

        showDanger(errorMessage);
      }
    }
  });

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`Falha ao conectar...`, err);
    }
  };

  return (
    <>
      <PageTitle>Criar conta</PageTitle>
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
                Criar conta
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
                style={{ fontSize: '14px', lineHeight: '20px' }}
              >
                Preencha as informações abaixo
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Input
                name="name"
                label="Nome"
                error={formik.touched.name ? formik.errors.name : ''}
                iconClass="fas fa-user"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <Select
                name="country"
                label="País"
                error={formik.touched.country ? formik.errors.country : ''}
                initialSelectedOptionId={formik.initialValues.country}
                options={COUNTRIES}
                onOptionSelected={(id) => formik.setFieldValue('country', id)}
                onBlur={formik.handleBlur}
              />
              <Input
                name="taxId"
                label="CPF ou Nº do Documento"
                error={formik.touched.taxId ? formik.errors.taxId : ''}
                iconclassName="fas fa-user"
                placeholder="000.000.000-00"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.taxId}
              />
              <div style={{ marginTop: '12px' }}>
                {connected ? (
                  <AddressButton>{shortenAddress(account, 16, 15)}</AddressButton>
                ) : (
                  <MetaMaskButton onClick={connect} />
                )}
              </div>
              <button
                disabled={formik.isSubmitting}
                className="br-button primary"
                type="submit"
                style={{ width: '100%', marginTop: '12px' }}
              >
                {formik.isSubmitting ? (
                  <div className="br-loading br-secondary" style={{ marginRight: '8px' }}></div>
                ) : (
                  'Continuar'
                )}
              </button>
            </form>
            <span className="br-divider my-4"></span>
            <Typography
              color="text.secondary"
              variant="body2"
              style={{ fontSize: '14px', lineHeight: '20px' }}
            >
              Já possui conta?
            </Typography>
            <button
              className="br-button secondary"
              type="button"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => router.push('/auth/login')}
            >
              Entrar
            </button>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
