import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { withAuthGuard } from 'src/hocs/with-auth-guard';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import {items} from "./config";
import {useAuth} from "../../hooks/use-auth";
import {useRouter} from "next/router";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH
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
  const pageConfig = items.find(item => item.path === pathname);

  const handlePathnameChange = useCallback(
    () => {
      if (openNav) {
        setOpenNav(false);
      }
    },
    [openNav]
  );

  useEffect(() => { handlePathnameChange(); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  if(pageConfig.roles && !pageConfig.roles?.includes(user?.role)) {
    if(!user) {
      router.replace('/auth/login')
          .catch(console.error);
      return <></>;
    }

    console.log(`Forbidden access to ${pathname}, redirecting`, {user, pageConfig});
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
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav
        onClose={() => setOpenNav(false)}
        open={openNav}
      />
      <LayoutRoot>
        <LayoutContainer>
          {children}
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
});