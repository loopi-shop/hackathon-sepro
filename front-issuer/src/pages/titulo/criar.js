import Head from 'next/head';
import { Box, Button, Container, Grid, Stack, TextField, Typography, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NumericFormat } from 'react-number-format';
import { addDays, format, differenceInDays } from 'date-fns';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CountryISOSelect } from 'src/components/country-iso-select';
import { useTPF } from 'src/hooks/use-tpf';
import { useSnackbar } from 'notistack';

const Page = () => {
  const { create, tpf } = useTPF();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      blocklistCountryCode: [''],
      startDate: format(new Date(), 'yyyy-MM-dd'),
    },
    validationSchema: Yup.object({
      blocklistCountryCode: Yup.array(Yup.string()),
      name: Yup.string().min(1, 'O nome deve conter pelo menos ${min} caractere')
        .required('O nome deve ser informado'),
      symbol: Yup.string().min(1, 'O símbolo deve conter pelo menos ${min} caractere')
        .required('O símbolo deve ser informado'),
      startDate: Yup.date()
        .required('A data de início deve ser informada'),
      expirationDate: Yup.date()
        .required('A data de expiração deve ser informada')
        .when('startDate', ([startDate]) => {
          return Yup.date()
            .min(addDays(startDate ?? new Date(), 30), ({ min }) => `A data de expiração deve ser maior que ${format(min, 'dd/MM/yyyy')}`)
            .typeError('A data de expiração deve ser informada')
        }),
      yieldPercent: Yup.number().min(0.01, 'O percentual de rendimento deve ser igual ou maior maior que ${min}')
        .required('O percentual de rendimento deve ser informado'),
      maxAssets: Yup.number().min(1, 'A emissão máxima deve ser igual ou maior que ${min}')
        .required('A emissão máxima deve ser informada'),

    }),
    onSubmit: async (values) => {
      const yieldPercent = parseInt(values.yieldPercent.replace('.', ''));
      const maxAssets = parseInt(values.maxAssets.replace('.', ''));
      const duration = differenceInDays(new Date(values.expirationDate), new Date());
      const tpfPayload = {
        yield: yieldPercent,
        durationDays: duration,
        blocklistCountryCode: values.blocklistCountryCode
          .filter((b) => b !== '')
          .map(Number),
        symbol: `LTN${values.symbol.toUpperCase()}`,
        name: `LTN${values.name.toUpperCase()}`,
        maxAssets,
        startDate: values.startDate,
      }
      try {
        const created = await create(tpfPayload);
        enqueueSnackbar(`Título criado (${created.contractAddress})`, {
          variant: "info",
          autoHideDuration: 10000,
        });

        formik.setFieldValue('blocklistCountryCode', formik.initialValues.blocklistCountryCode);
        formik.setFieldValue('startDate', formik.initialValues.startDate);
        formik.setFieldValue('name', '');
        formik.setFieldValue('symbol', '');
        formik.setFieldValue('expirationDate', '');
        formik.setFieldValue('yieldPercent', '');
        formik.setFieldValue('maxAssets', '');
      } catch (error) {
        console.error(`error on create`, error);
        enqueueSnackbar(`Erro para criar o título`, {
          variant: "error",
          autoHideDuration: 10000,
        });
      }
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
                  Cadastro de Título Público LTN
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
                    InputProps={{
                      startAdornment: <InputAdornment position="start">LTN</InputAdornment>,
                    }}
                    inputProps={{
                      style: { textTransform: "uppercase" },
                    }}
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
                    InputProps={{
                      startAdornment: <InputAdornment position="start">LTN</InputAdornment>,
                    }}
                    inputProps={{
                      style: { textTransform: "uppercase" },
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  {...gridItemSize}
                >
                  <TextField
                    error={!!(formik.touched.startDate && formik.errors.startDate)}
                    helperText={formik.touched.startDate && formik.errors.startDate}
                    name="startDate"
                    label="Data de Inicio"
                    fullWidth
                    type="date"
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
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
                  <NumericFormat
                    error={!!(formik.touched.maxAssets && formik.errors.maxAssets)}
                    helperText={formik.touched.maxAssets && formik.errors.maxAssets}
                    fullWidth
                    label="Emissão Máxima"
                    name="maxAssets"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.maxAssets}
                    decimalScale={6}
                    fixedDecimalScale
                    customInput={TextField}
                    valueIsNumericString={false}
                  />
                </Grid>
                <Grid
                  item
                  {...gridItemSize}
                >
                  <CountryISOSelect
                    error={!!(formik.touched.blocklistCountryCode && formik.errors.blocklistCountryCode)}
                    helperText={formik.touched.blocklistCountryCode && formik.errors.blocklistCountryCode}
                    name="blocklistCountryCode"
                    label="Blocklist País"
                    fullWidth
                    multiple
                    value={formik.values.blocklistCountryCode}
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
                    disabled={tpf.isLoading}
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