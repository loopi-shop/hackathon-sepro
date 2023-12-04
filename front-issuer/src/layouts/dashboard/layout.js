import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { Stack, useMediaQuery } from '@mui/material';
import { withAuthGuard } from 'src/hocs/with-auth-guard';
import { SideNav } from './side-nav';
import { items } from './config';
import { useAuth } from '../../hooks/use-auth';
import { useRouter } from 'next/router';
import { DashboardHeader } from './header';

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme, ...props }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  marginLeft: props.openNav ? SIDE_NAV_WIDTH : 0,
  transition: theme.transitions.create(['margin-left'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(props.openNav && {
    transition: theme.transitions.create(['margin-left'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  }),
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0
  }
}));

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%'
});

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const pathname = usePathname();
  const router = useRouter();
  const [openNav, setOpenNav] = useState(false);
  const { user } = useAuth();
  const idDownLg = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const pageConfig = items.find((item) => item.path === pathname);

  const handlePathnameChange = useCallback(() => {
    if (openNav && idDownLg) {
      setOpenNav(false);
    }
  }, [openNav, idDownLg]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  if (pageConfig?.roles && !pageConfig.roles?.includes(user?.role)) {
    if (!user) {
      router.replace('/auth/login').catch(console.error);
      return <></>;
    }

    console.error(`Forbidden access to ${pathname}, redirecting`, { user, pageConfig });
    router
      .replace({
        pathname: '/404',
        query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
      })
      .catch(console.error);
    return <></>;
  }

  return (
    <>
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot openNav={openNav}>
        <Stack style={{ width: '100%' }}>
          <DashboardHeader onMenuClick={() => setOpenNav((value) => !value)} />
          <LayoutContainer>{children}</LayoutContainer>
        </Stack>
      </LayoutRoot>
    </>
  );
});
