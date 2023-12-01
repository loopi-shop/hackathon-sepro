import { Box, Container, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { PageTitle } from 'src/components/page-title';
import WalletPage from './carteira';
import TPFPage from './titulo';

const now = new Date();

const Page = () => (
  <>
    <PageTitle>Início</PageTitle>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h1">Início</Typography>
        <WalletPage embedded />
        <TPFPage embedded />
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
