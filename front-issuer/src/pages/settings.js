import { Box, Container, Stack, Typography } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { PageTitle } from 'src/components/page-title';

const Page = () => (
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      py: 8
    }}
  >
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Typography variant="h4">Settings</Typography>
        <SettingsNotifications />
        <SettingsPassword />
      </Stack>
    </Container>
  </Box>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    <PageTitle>Configurações</PageTitle>
    {page}
  </DashboardLayout>
);

export default Page;
