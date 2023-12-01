import PropTypes from 'prop-types';
import { Box, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { AuthHeader } from './header';

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;

  return (
    <>
      <AuthHeader />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: '1 1 auto'
        }}
      >
        <Grid container sx={{ flex: '1 1 auto' }}>
          <Grid
            xs={12}
            lg={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {children}
          </Grid>
          <Grid
            xs={12}
            lg={6}
            sx={{
              alignItems: 'center',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              '& img': {
                maxWidth: '100%'
              }
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                align="center"
                color="inherit"
                sx={{
                  fontSize: '24px',
                  lineHeight: '32px',
                  mb: 1
                }}
                variant="h1"
              >
                Welcome to{' '}
                <Box component="a" sx={{ color: '#15B79E' }} target="_blank">
                  Devias Kit
                </Box>
              </Typography>
              <Typography align="center" sx={{ mb: 3 }} variant="subtitle1">
                A professional kit that comes with ready-to-use MUI components.
              </Typography>
              <img alt="" src="/assets/auth-illustration.svg" />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

Layout.prototypes = {
  children: PropTypes.node
};
