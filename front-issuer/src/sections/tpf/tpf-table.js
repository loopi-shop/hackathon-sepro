import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { RoleEnum } from 'src/contexts/auth-context';
import { useAuth } from 'src/hooks/use-auth';
import { addDays, format } from 'date-fns';
import { useTPF } from 'src/hooks/use-tpf';
import { useSnackbar } from 'notistack';
import { TPFItemCard } from './tpf-item-card';
import { CardsList } from 'src/components/cards';
import { ethers } from "ethers";
import { TPFHolders } from './tpf-holders';
import { TPFPagination } from './tpf-pagination';
import { TPFWithdraw } from './tpf-withdraw';

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
      if (!rowData.startTimestamp || !rowData.durationDays) return '';
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
    roles: [RoleEnum.ADMIN],
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
    onPageChange = (event, value) => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 6,
    handleOpenBuy,
    embedded = false
  } = props;

  const { hasRole, user, isAdmin } = useAuth();
  const { listHolders, redeem, broadcast, transfer, getTotalSupply } = useTPF();
  const { enqueueSnackbar } = useSnackbar();

  const [openHolders, setOpenHolders] = useState(false);
  const [selectedTPF, setSelectedTPF] = useState({});
  const [holders, setHolders] = useState([]);

  const handleOpenHolders = (tpf) => {
    setSelectedTPF(tpf);
    listHolders({ contractAddress: tpf.contractAddress })
      .then((holders) => {
        setHolders(holders);
        setOpenHolders(true);
      })
      .catch((error) => {
        console.error(`listHolders:`, error);
        enqueueSnackbar(`Erro para listar os clientes do token: ${tpf.symbol}`, {
          variant: 'error',
          autoHideDuration: 10000
        });
      });
  }

  const closeHolders = () => {
    setOpenHolders(false);
    setSelectedTPF(undefined);
    setHolders([]);
  }

  const headers = useMemo(() => {
    return tableHeaders.filter((value) => hasRole(value.roles));
  }, [user]);

  const transferToRedeem = async (tpfContractAddress) => {
    console.info('Depositando no Título:', tpf);
    const quantity = (await getTotalSupply({ contractAddress: tpfContractAddress })) * 1000;
    if (quantity === 0) {
      console.error('Erro ao liquidar, total supply igual a zero');
      throw Error('Erro ao liquidar, total supply igual a zero');
    }

    const transferInput = {
      quantity,
      contractAddress: process.env.NEXT_PUBLIC_BRLX_CONTRACT,
      signer: new ethers.Wallet(process.env.NEXT_PUBLIC_ADM_PRIVATE_KEY, new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)),
      to: tpfContractAddress,
    };

    console.info('entradas para deposito', transferInput);
    const transaction = await transfer(transferInput);
    console.info('Resultado do depósito do título', transaction);
  }

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
      await transferToRedeem(tpf.contractAddress);
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

  const [openWithdraw, setOpenWithdraw] = useState(false);

  const handleOpenWithdraw = (tpf) => {
    setSelectedTPF(tpf);
    setOpenWithdraw(true);
  }

  const closeWithdraw = () => {
    setOpenWithdraw(false);
    setSelectedTPF({});
  }

  return (
    <>
      <TPFWithdraw
        open={openWithdraw}
        handleClose={closeWithdraw}
        tpf={selectedTPF}
      />
      <TPFHolders
        open={openHolders}
        handleClose={closeHolders}
        tpf={selectedTPF}
        holders={holders}
        setHolders={setHolders}
      />
      <CardsList>
        {items.map(TPFItemCard({
          unitPriceList,
          totalAssetsList,
          totalSupplyList,
          balanceList,
          headers,
          settleLoading,
          isAdmin,
          settle,
          buy,
          handleOpenWithdraw,
          openHolders: handleOpenHolders,
        }))}
      </CardsList>
      {!embedded && (
        <TPFPagination
          page={page}
          rowsPerPage={rowsPerPage}
          count={count}
          onPageChange={onPageChange}
        />
      )}
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