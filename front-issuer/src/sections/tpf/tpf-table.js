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
      if (!rowData.startTimestamp || !rowData.durationDays) return '';

      const expirationDate = addDays(rowData.startTimestamp, rowData.durationDays);
      return format(expirationDate, 'dd/MM/yyyy');
    }
  },
  {
    key: 'maxAssets',
    description: 'Total Emitido (BRLX)',
    roles: [RoleEnum.ADMIN],
    format: ({ rowData, value }) => {
      return (value / 10 ** rowData.decimals).toFixed(rowData.decimals);
    }
  },
  {
    key: 'minimumValue',
    description: 'Valor mínimo (BRLX)',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN]
  },
  {
    key: 'yield',
    description: 'Rentabilidade (%)',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN],
    format: ({ value }) => (value / 100).toFixed(2)
  },
  {
    key: 'unitPrice',
    description: 'Preço Unitário',
    roles: [RoleEnum.COMMON, RoleEnum.ADMIN]
  }
];

export const TPFTable = (props) => {
  const {
    count = 0,
    items = [],
    unitPriceList = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    handleOpenBuy,
    embedded = false
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
      console.log(`tx:redeem:`, tx);
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
        {items.map(TPFItemCard(unitPriceList, headers, settleLoading, isAdmin, settle, buy))}
      </CardsList>
      {!embedded && (
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[8, 16, 64]}
        />
      )}
    </>
  );
};

TPFTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  unitPriceList: PropTypes.array,
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
