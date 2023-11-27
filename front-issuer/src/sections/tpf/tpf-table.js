import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  SvgIcon,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { TableRowsLoader } from 'src/components/table-rows-loader';
import { useMemo } from 'react';
import { RoleEnum } from 'src/contexts/auth-context';
import { useAuth } from 'src/hooks/use-auth';
import { addDays, format } from 'date-fns';
import WalletIcon from '@heroicons/react/24/solid/WalletIcon';
import BanknotesIcon from '@heroicons/react/24/solid/BanknotesIcon';

const tableHeaders = [
  {
    key: 'symbol',
    description: 'Sigla',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
  },
  {
    key: 'expirationDate',
    description: 'Data de vencimento',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
    format: ({ rowData }) => {
      const expirationDate = addDays(rowData.startTimestamp, rowData.durationDays);
      return format(expirationDate, 'dd/MM/yyyy');
    }
  },
  {
    key: 'maxAssets',
    description: 'Total Emitido (BRLY)',
    roles: [RoleEnum.ADMIN],
    format: ({ rowData, value }) => {
      return (value / 10 ** rowData.decimals).toFixed(rowData.decimals);
    }
  },
  {
    key: 'minimumValue',
    description: 'Valor mínimo (BRLY)',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
  },
  {
    key: 'yield',
    description: 'Rentabilidade (%)',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
    format: ({ value }) => (value / 100).toFixed(2),
  },
];

export const TPFTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    isLoading = false,
    handleOpenBuy,
  } = props;

  const { hasRole, user } = useAuth();

  const isAdmin = useMemo(() => {
    return hasRole([RoleEnum.ADMIN]);
  }, [user]);

  const headers = useMemo(() => {
    return tableHeaders.filter((value) => hasRole(value.roles))
  }, [user])

  const settle = (tpf) => {
    console.info('Liquidando Titulo:', tpf);
  }

  const buy = (tpf) => {
    console.info('Comprando Titulo:', tpf);
    handleOpenBuy(tpf);
  }

  const rows = useMemo(() => {
    return items.map((tpf) => {
      return (
        <TableRow
          hover
          key={tpf.symbol}
        >
          {headers.map(({ key, format }) => (
            <TableCell key={key}>
              {format ? format({ rowData: tpf, value: tpf[key] }) : tpf[key]}
            </TableCell>
          ))}
          <TableCell>
            <Tooltip title={isAdmin ? "Liquidar" : "Comprar"}>
              <IconButton onClick={() => isAdmin ? settle(tpf) : buy(tpf)}>
                <SvgIcon fontSize="small">
                  {isAdmin ? <BanknotesIcon /> : <WalletIcon />}
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    })
  }, [headers, selected, items])

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map(({ key, description }) => (
                  <TableCell key={key}>
                    {description}
                  </TableCell>
                ))}
                <TableCell>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRowsLoader rowsNum={3} columnsNum={headers.length + 1} /> : rows}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

TPFTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  isLoading: PropTypes.bool,
  handleOpenBuy: PropTypes.func,
};
