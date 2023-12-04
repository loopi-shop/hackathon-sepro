import { Box, Container, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { PageTitle } from 'src/components/page-title';
import WalletPage from './carteira';
import TPFPage from './titulo';
import { useAuth } from 'src/hooks/use-auth';

const now = new Date();

const Page = () => {
  const { isAdmin } = useAuth();

  return (
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
          <Container
            maxWidth="xl"
            sx={{
              p: 0,
              m: 0,
              display: 'flex',
              flexDirection: isAdmin ? 'column-reverse' : 'column'
            }}
          >
            <WalletPage embedded />
            <TPFPage embedded />
          </Container>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
