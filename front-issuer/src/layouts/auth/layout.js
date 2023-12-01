import PropTypes from 'prop-types';
import { Box, Unstable_Grid2 as Grid } from '@mui/material';
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
            lg={8}
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
            <img alt="" src="/assets/auth-hero.png" />
          </Grid>
          <Grid
            xs={12}
            lg={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {children}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

Layout.prototypes = {
  children: PropTypes.node
};
