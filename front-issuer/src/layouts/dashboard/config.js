import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import TableCellsIcon from '@heroicons/react/24/solid/TableCellsIcon';
import PlusCircleIcon from '@heroicons/react/24/solid/PlusCircleIcon';
import { SvgIcon } from '@mui/material';
import { RoleEnum } from '../../contexts/auth-context';

export const items = [
  {
    title: 'Início',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Clientes',
    path: '/clientes',
    roles: [RoleEnum.ADMIN],
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Títulos',
    path: '/titulo',
    icon: (
      <SvgIcon fontSize="small">
        <TableCellsIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Registrar Título',
    path: '/titulo/criar',
    roles: [RoleEnum.ADMIN],
    icon: (
      <SvgIcon fontSize="small">
        <PlusCircleIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Minha carteira',
    path: '/carteira',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Mercado secundário',
    path: '/mercado-secundario',
    roles: [RoleEnum.COMMON],
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  }
];
