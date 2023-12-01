import { useState } from 'react';
import PropTypes from 'prop-types';
import { TablePagination } from '@mui/material';
import { useMemo } from 'react';
import { RoleEnum } from 'src/contexts/auth-context';
import { useAuth } from 'src/hooks/use-auth';
import { addDays, format } from 'date-fns';
import { useTPF } from 'src/hooks/use-tpf';
import { useSnackbar } from 'notistack';
import { TPFItemCard } from './tpf-item-card';
import { CardsList } from 'src/components/cards';

function isLoadingValue(value) {
  return value === null || value === undefined || value < 0;
}

const tableHeaders = [
  {
    key: 'symbol',
    description: 'Sigla',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN]
  },
  {
    key: 'expirationDate',
    description: 'Data de vencimento',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
    format: ({ rowData }) => {
      // FIX addDays returning date -1
      const expirationDate = addDays(rowData.startTimestamp, rowData.durationDays + 1);
      return format(expirationDate, 'dd/MM/yyyy');
    }
  },
  {
    key: 'totalAssets',
    description: 'Total Arrecadado (BRLX)',
    roles: [RoleEnum.ADMIN],
    format: ({ rowData, value }) => {
      return isLoadingValue(value)
        ? 'Carregando...'
        : (value / 10 ** rowData.decimals).toFixed(rowData.decimals)
    }
  },
  {
    key: 'totalSupply',
    description: 'Total Emitido',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
    format: ({ rowData, value }) => {
      return isLoadingValue(value)
        ? 'Carregando...'
        : (value / 10 ** rowData.decimals).toFixed(rowData.decimals)
    }
  },
  {
    key: 'yield',
    description: 'Rentabilidade (%)',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
    format: ({ value }) => `${(value / 100).toFixed(2)}% a.a.`
  },
  {
    key: 'unitPrice',
    description: 'Preço Unitário',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
    format: ({ rowData, value }) => {
      return isLoadingValue(value)
        ? 'Carregando...'
        : (value / 10 ** rowData.decimals).toFixed(rowData.decimals)
    }
  },
  {
    key: 'balance',
    description: 'Saldo Disponível (BRLX)',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
    format: ({ rowData, value }) => {
      return isLoadingValue(value)
        ? 'Carregando...'
        : (value / 10 ** rowData.decimals).toFixed(rowData.decimals)
    }
  },
];

export const TPFTable = (props) => {
  const {
    count = 0,
    items = [],
    unitPriceList = [],
    totalAssetsList = [],
    totalSupplyList = [],
    balanceList = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    handleOpenBuy
  } = props;

  const { hasRole, user } = useAuth();
  const { redeem, broadcast } = useTPF();
  const { enqueueSnackbar } = useSnackbar();

  const isAdmin = useMemo(() => {
    return hasRole([RoleEnum.ADMIN]);
  }, [user]);

  const headers = useMemo(() => {
    return tableHeaders.filter((value) => hasRole(value.roles));
  }, [user]);

  const [settleLoading, setSettleLoading] = useState({});
  const settle = async (tpf) => {
    setSettleLoading((old) => {
      const newState = {
        ...old,
        [tpf.symbol]: true
      };
      return newState;
    });
    try {
      console.info('Liquidando Titulo:', tpf);
      const tx = await redeem({ contractAddress: tpf.contractAddress, from: user.publicKey });
      console.info(`tx:redeem:`, tx);
      const { txHash } = await broadcast({ tx });
      enqueueSnackbar(`Transação de liquidação: ${txHash}`, {
        variant: 'info',
        autoHideDuration: 10000
      });
    } catch (error) {
      console.error(`redeem:`, error);
      enqueueSnackbar(` Erro para liquidar o token: ${tpf.symbol}`, {
        variant: 'error',
        autoHideDuration: 10000
      });
    } finally {
      setSettleLoading((old) => {
        const newState = {
          ...old,
          [tpf.symbol]: false
        };
        return newState;
      });
    }
  };

  const buy = (tpf) => {
    console.info('Comprando Titulo:', tpf);
    handleOpenBuy(tpf);
  };

  return (
    <>
      <CardsList>
        {items.map(TPFItemCard(unitPriceList, totalAssetsList, totalSupplyList, balanceList, headers, settleLoading, isAdmin, settle, buy))}
      </CardsList>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[8, 16, 64]}
        labelRowsPerPage="Linhas por página:"
        getItemAriaLabel={(type) => {
          switch (type) {
            case 'first':
              return 'Primeira página';
            case 'last':
              return 'Última página';
            case 'next':
              return 'Próxima página';
            case 'previous':
              return 'Página anterior';
          }
        }}
      />
    </>
  );
};

TPFTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  unitPriceList: PropTypes.array,
  totalAssetsList: PropTypes.array,
  totalSupplyList: PropTypes.array,
  balanceList: PropTypes.array,
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
  handleOpenBuy: PropTypes.func
};