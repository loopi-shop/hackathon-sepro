import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NumericFormat } from 'react-number-format';
import { addDays, format, differenceInDays } from 'date-fns';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useTPF } from 'src/hooks/use-tpf';
import { useSnackbar } from 'notistack';
import { PageTitle } from 'src/components/page-title';
import { Input } from 'src/components/input';
import { SelectMultiple } from 'src/components/select';
import COUNTRY_LIST from 'src/components/country-list.json';

const COUNTRIES = COUNTRY_LIST.map((country) => ({
  id: country.code,
  value: country.name
}));

const Page = () => {
  const { create, tpf } = useTPF();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      name: '',
      symbol: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      expirationDate: format(new Date(), 'yyyy-MM-dd'),
      yieldPercent: '',
      maxAssets: '',
      blocklistCountryCode: []
    },
    validationSchema: Yup.object({
      blocklistCountryCode: Yup.array(Yup.string()),
      name: Yup.string()
        .min(1, 'O nome deve conter pelo menos ${min} caractere')
        .required('O nome deve ser informado'),
      symbol: Yup.string()
        .min(1, 'O símbolo deve conter pelo menos ${min} caractere')
        .required('O símbolo deve ser informado'),
      startDate: Yup.date().required('A data de início deve ser informada'),
      expirationDate: Yup.date()
        .required('A data de expiração deve ser informada')
        .when('startDate', ([startDate]) => {
          return Yup.date()
            .min(
              addDays(startDate ?? new Date(), 30),
              ({ min }) => `A data de expiração deve ser maior que ${format(min, 'dd/MM/yyyy')}`
            )
            .typeError('A data de expiração deve ser informada');
        }),
      yieldPercent: Yup.number()
        .min(0.01, 'O percentual de rendimento deve ser igual ou maior maior que ${min}')
        .required('O percentual de rendimento deve ser informado'),
      maxAssets: Yup.number()
        .min(1, 'A emissão máxima deve ser igual ou maior que ${min}')
        .required('A emissão máxima deve ser informada')
    }),
    onSubmit: async (values) => {
      const yieldPercent = parseInt(values.yieldPercent.replace('.', ''));
      const maxAssets = parseInt(values.maxAssets.replace('.', ''));
      const duration = differenceInDays(new Date(values.expirationDate), new Date());
      const tpfPayload = {
        yield: yieldPercent,
        durationDays: duration,
        blocklistCountryCode: values.blocklistCountryCode.filter((b) => b !== '').map(Number),
        symbol: `LTN${values.symbol.toUpperCase()}`,
        name: `LTN${values.name.toUpperCase()}`,
        maxAssets,
        startDate: values.startDate
      };
      try {
        const created = await create(tpfPayload);
        enqueueSnackbar(`Título criado (${created.contractAddress})`, {
          variant: 'info',
          autoHideDuration: 10000
        });

        formik.setFieldValue(
          'blocklistCountryCode',
          formik.initialValues.blocklistCountryCode,
          false
        );
        formik.setFieldValue('startDate', formik.initialValues.startDate, false);
        formik.setFieldValue('name', '', false);
        formik.setFieldValue('symbol', '', false);
        formik.setFieldValue('expirationDate', '', false);
        formik.setFieldValue('yieldPercent', '', false);
        formik.setFieldValue('maxAssets', '', false);
      } catch (error) {
        console.error(`error on create`, error);
        enqueueSnackbar(`Erro para criar o título`, {
          variant: 'error',
          autoHideDuration: 10000
        });
      }
    }
  });

  const gridItemSize = {
    lg: 3,
    md: 3,
    sm: 6,
    xs: 12
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">Cadastro de Título Público LTN</Typography>
            </Stack>
          </Stack>
          <form noValidate onSubmit={formik.handleSubmit} style={{ marginTop: '40px' }}>
            <Grid container spacing={2}>
              <Grid item {...gridItemSize}>
                <Input
                  name="name"
                  label="Nome"
                  placeholder="LTN"
                  error={formik.touched.name ? formik.errors.name : ''}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  style={{ textTransform: 'uppercase' }}
                />
              </Grid>
              <Grid item {...gridItemSize}>
                <Input
                  name="symbol"
                  label="Símbolo"
                  placeholder="LTN"
                  error={formik.touched.symbol ? formik.errors.symbol : ''}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.symbol}
                  style={{ textTransform: 'uppercase' }}
                />
              </Grid>
              <Grid item {...gridItemSize}>
                <Input
                  name="startDate"
                  type="date"
                  label="Data de início"
                  error={formik.touched.startDate ? formik.errors.startDate : ''}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.startDate}
                />
              </Grid>
              <Grid item {...gridItemSize}>
                <Input
                  name="expirationDate"
                  type="date"
                  label="Data de Vencimento"
                  error={formik.touched.expirationDate ? formik.errors.expirationDate : ''}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.expirationDate}
                />
              </Grid>
              <Grid item {...gridItemSize}>
                <NumericFormat
                  name="yieldPercent"
                  label="Rentabilidade ao ano (%)"
                  error={formik.touched.yieldPercent ? formik.errors.yieldPercent : ''}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.yieldPercent}
                  decimalScale={2}
                  fixedDecimalScale
                  customInput={Input}
                  valueIsNumericString={false}
                />
              </Grid>
              <Grid item {...gridItemSize}>
                <NumericFormat
                  name="maxAssets"
                  label="Emissão Máxima"
                  error={formik.touched.maxAssets ? formik.errors.maxAssets : ''}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.maxAssets}
                  decimalScale={6}
                  fixedDecimalScale
                  customInput={Input}
                  valueIsNumericString={false}
                />
              </Grid>
              <Grid item {...gridItemSize}>
                <SelectMultiple
                  name="blocklistCountryCode"
                  label="País bloqueados"
                  error={
                    formik.touched.blocklistCountryCode ? formik.errors.blocklistCountryCode : ''
                  }
                  initialSelectedOptionIds={formik.initialValues.blocklistCountryCode}
                  options={COUNTRIES}
                  onOptionSelected={(ids) => formik.setFieldValue('blocklistCountryCode', ids)}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
            </Grid>
            <Grid container sx={{ mt: 1 }} spacing={2} direction="row" justifyContent="flex-end">
              <Grid item {...gridItemSize}>
                <button
                  disabled={formik.isSubmitting}
                  className="br-button primary"
                  type="submit"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  {tpf.isLoading ? (
                    <div className="br-loading br-secondary" style={{ marginRight: '8px' }}></div>
                  ) : (
                    'Registrar'
                  )}
                </button>
              </Grid>
            </Grid>
          </form>
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <PageTitle>Cadastro de título</PageTitle>
    {page}
  </DashboardLayout>
);

export default Page;
