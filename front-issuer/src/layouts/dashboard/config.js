import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import TableCellsIcon from '@heroicons/react/24/solid/TableCellsIcon';
import { SvgIcon } from '@mui/material';
import { RoleEnum } from "../../contexts/auth-context";

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Customers',
    path: '/customers',
    roles: [RoleEnum.ADMIN],
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Títulos',
    path: '/tpf',
    icon: (
      <SvgIcon fontSize="small">
        <TableCellsIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Mint BRLY',
    path: '/mint-brly',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  }
];