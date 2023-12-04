import { useContext, useMemo } from 'react';
import { AuthContext, RoleEnum } from 'src/contexts/auth-context';

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  const isAdmin = useMemo(() => {
    return authContext.hasRole([RoleEnum.ADMIN]);
  }, [authContext.user]);

  return { ...authContext, isAdmin };
};
