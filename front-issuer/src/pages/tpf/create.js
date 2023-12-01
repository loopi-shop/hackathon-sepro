import Head from 'next/head';
import { Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NumericFormat } from 'react-number-format';
import { addDays, format } from 'date-fns';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CountryISOSelect } from 'src/components/country-iso-select';

const Page = () => {
  const formik = useFormik({
    initialValues: {
      blacklistCountryCode: [''],
    },
    validationSchema: Yup.object({
      blacklistCountryCode: Yup.array(Yup.string()),
      name: Yup.string().min(1, 'O nome deve conter pelo menos ${min} caractere')
        .required('O nome deve ser informado'),
      symbol: Yup.string().min(1, 'O símbolo deve conter pelo menos ${min} caractere')
        .required('O símbolo deve ser informado'),
      expirationDate: Yup.date()
        .min(addDays(new Date(), 30), ({ min }) => {
          return `A data de expiração deve ser maior que ${format(min, 'dd/MM/yyyy')}`;
        })
        .required('A data de expiração é obrigatória'),
      yieldPercent: Yup.number().min(0.01, 'O percentual de rendimento deve ser igual ou maior maior que ${min}')
        .required('O percentual de rendimento deve ser informado'),
      maxAssets: Yup.number().min(1, 'A emissão máxima deve ser igual ou maior que ${min}')
        .required('A emissão máxima deve ser informada'),

    }),
    onSubmit: async (values) => {
      console.info(`submitted:`, values);
    }
  });

  const gridItemSize = {
    lg: 3,
    md: 3,
    sm: 6,
    xs: 12,
  }

  return (
    <>
      <Head>
        <title>
          TPF | Cadastro de título
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Cadastro de Título
                </Typography>
              </Stack>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  {...gridItemSize}
                >
                  <TextField
                    error={!!(formik.touched.name && formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    name="name"
                    label="Nome"
                    fullWidth
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  {...gridItemSize}
                >
                  <TextField
                    error={!!(formik.touched.symbol && formik.errors.symbol)}
                    helperText={formik.touched.symbol && formik.errors.symbol}
                    name="symbol"
                    label="Símbolo"
                    fullWidth
                    value={formik.values.symbol}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  {...gridItemSize}
                >
                  <TextField
                    error={!!(formik.touched.expirationDate && formik.errors.expirationDate)}
                    helperText={formik.touched.expirationDate && formik.errors.expirationDate}
                    name="expirationDate"
                    label="Data de Vencimento"
                    fullWidth
                    type="date"
                    value={formik.values.expirationDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid
                  item
                  {...gridItemSize}
                >
                  <NumericFormat
                    error={!!(formik.touched.yieldPercent && formik.errors.yieldPercent)}
                    helperText={formik.touched.yieldPercent && formik.errors.yieldPercent}
                    fullWidth
                    label="Rentabilidade ao ano (%)"
                    name="yieldPercent"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.yieldPercent}
                    decimalScale={2}
                    fixedDecimalScale
                    customInput={TextField}
                    valueIsNumericString={false}
                  />
                </Grid>
                <Grid
                  item
                  {...gridItemSize}
                >
                  <TextField
                    error={!!(formik.touched.maxAssets && formik.errors.maxAssets)}
                    helperText={formik.touched.maxAssets && formik.errors.maxAssets}
                    name="maxAssets"
                    label="Emissão Máxima"
                    type="number"
                    fullWidth
                    value={formik.values.maxAssets}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  {...gridItemSize}
                >
                  <CountryISOSelect
                    error={!!(formik.touched.blacklistCountryCode && formik.errors.blacklistCountryCode)}
                    helperText={formik.touched.blacklistCountryCode && formik.errors.blacklistCountryCode}
                    name="blacklistCountryCode"
                    label="Blacklist País"
                    fullWidth
                    multiple
                    value={formik.values.blacklistCountryCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
              </Grid>
              <Grid
                container
                sx={{ mt: 1 }}
                spacing={2}
                direction="row"
                justifyContent="flex-end"
              >
                <Grid
                  item
                  {...gridItemSize}
                >
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Registrar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;