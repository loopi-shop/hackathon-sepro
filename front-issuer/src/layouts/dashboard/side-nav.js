import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Stack, useMediaQuery } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { useAuth } from '../../hooks/use-auth';
import { SideNavBottom } from './side-nav-bottom';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const { user } = useAuth();

  // Only returns items filtered by user role
  const filteredItems = items.filter((item) => {
    return !item.roles || (user?.role && item.roles.includes(user?.role));
  });

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box component={NextLink} href="/" sx={{ display: 'inline-flex' }}>
            <img src="/assets/logos/loopi-logo-side-nav.png" />
          </Box>
          <button
            className="br-button small circle"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </Box>
        <Divider sx={{ borderColor: '#ccc' }} />
        <Stack
          component="nav"
          sx={{
            flexGrow: 1,
            justifyContent: 'space-between'
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {filteredItems.map((item) => {
              const active = item.path ? pathname === item.path : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
          <SideNavBottom />
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'white', //'neutral.800',
          color: '#1351B4',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant={lgUp ? 'persistent' : 'temporary'}
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
