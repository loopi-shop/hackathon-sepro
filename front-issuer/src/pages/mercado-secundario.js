import { Box, Button, Container, Grid, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { PageTitle } from 'src/components/page-title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MySellOrders } from 'src/sections/secondaryMarket/my-sell-orders';
import { MyBuyOrders } from 'src/sections/secondaryMarket/my-buy-orders';
import { useState } from 'react';
import { SellOrder } from 'src/sections/secondaryMarket/sell-order';

const now = new Date();

const Page = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <SellOrder open={open} handleClose={() => setOpen(false)} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h1">Mercado secundário</Typography>

            <Button
              onClick={() => setOpen(true)}
              style={{ borderRadius: '50px', padding: '8px 24px' }}
              variant="contained"
              color="primary"
              startIcon={
                <SvgIcon fontSize="small">
                  <FontAwesomeIcon icon={faPlus} />
                </SvgIcon>
              }
            >
              Vender ativo
            </Button>
          </Box>
          <MyBuyOrders />
          <MySellOrders />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <PageTitle>Mercado secundário</PageTitle>
    {page}
  </DashboardLayout>
);

export default Page;
