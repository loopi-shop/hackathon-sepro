import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TPFTable } from 'src/sections/tpf/tpf-table';
import { TPFBuy } from 'src/sections/tpf/tpf-buy';
import { applyPagination } from 'src/utils/apply-pagination';
import { useTPF } from 'src/hooks/use-tpf';
import { PageTitle } from 'src/components/page-title';
import { useAuth } from 'src/hooks/use-auth';
import Link from 'next/link';

const useTPFs = (page, rowsPerPage, data) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage, data]);
};

const useTPFIds = (tpfs) => {
  return useMemo(() => {
    return tpfs.map((tpf) => tpf.acronym);
  }, [tpfs]);
};

export const TPFPage = ({ embedded }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [unitPriceList, setUnitPriceList] = useState([]);
  const [totalAssetsList, setTotalAssetsList] = useState([]);
  const [totalSupplyList, setTotalSupplyList] = useState([]);
  const [balanceList, setBalanceList] = useState([]);
  const { list, tpfs, getPrice, getTotalAssets, getTotalSupply, balanceOf } = useTPF();
  const tpfsPaginated = useTPFs(page, rowsPerPage, tpfs?.data ?? []);
  const tpfIds = useTPFIds(tpfsPaginated);
  const tpfsSelection = useSelection(tpfIds);
  const { user } = useAuth();

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const [buyTPF, setBuyTPF] = useState(undefined);
  const [isOpenBuy, setOpenBuy] = useState(false);
  const handleOpenBuy = (buyTPF) => {
    window.history.pushState({ buyTPF }, '', `/titulo#${buyTPF.symbol}`);
    setBuyTPF(buyTPF);
    setOpenBuy(true);
  };
  const handleCloseBuy = () => {
    window.history.replaceState({}, '', `/titulo`);
    setOpenBuy(false);
    setBuyTPF(undefined);
  };

  const loadUnitPriceList = async () => {
    if (!tpfs.isLoading && tpfs?.data?.length > 0) {
      const chunks = _.chunk(tpfs?.data ?? [], rowsPerPage);
      const timestamp = Date.now() / 1000;
      let tempPrices = [];
      for (let index = 0; index < chunks.length; index++) {
        const tpfChunk = chunks[index];
        const pricesSettled = await Promise.allSettled(
          tpfChunk.map((tpf) =>
            getPrice({
              contractAddress: tpf.contractAddress,
              timestamp
            }).then((price) => ({
              symbol: tpf.symbol,
              price
            }))
          )
        );
        tempPrices = pricesSettled.reduce((acc, cur) => {
          if (cur.status !== 'fulfilled') return acc;
          return acc.concat(cur.value);
        }, tempPrices);
      }
      setUnitPriceList(tempPrices);
    }
  };

  const loadTotalAssetsList = async () => {
    if (!tpfs.isLoading && tpfs?.data?.length > 0) {
      const chunks = _.chunk(tpfs?.data ?? [], rowsPerPage);
      let tempTotalAssets = [];
      for (let index = 0; index < chunks.length; index++) {
        const tpfChunk = chunks[index];
        const totalAssetsSettled = await Promise.allSettled(
          tpfChunk.map((tpf) =>
            getTotalAssets({
              contractAddress: tpf.contractAddress,
            }).then((totalAssets) => ({
              symbol: tpf.symbol,
              totalAssets
            }))
          )
        );
        tempTotalAssets = totalAssetsSettled.reduce((acc, cur) => {
          if (cur.status !== 'fulfilled') return acc;
          return acc.concat(cur.value);
        }, tempTotalAssets);
      }
      setTotalAssetsList(tempTotalAssets);
    }
  };

  const loadTotalSupplyList = async () => {
    if (!tpfs.isLoading && tpfs?.data?.length > 0) {
      const chunks = _.chunk(tpfs?.data ?? [], rowsPerPage);
      let tempTotalSupply = [];
      for (let index = 0; index < chunks.length; index++) {
        const tpfChunk = chunks[index];
        const totalSupplySettled = await Promise.allSettled(
          tpfChunk.map((tpf) =>
            getTotalSupply({
              contractAddress: tpf.contractAddress,
            }).then((totalSupply) => ({
              symbol: tpf.symbol,
              totalSupply
            }))
          )
        );
        tempTotalSupply = totalSupplySettled.reduce((acc, cur) => {
          if (cur.status !== 'fulfilled') return acc;
          return acc.concat(cur.value);
        }, tempTotalSupply);
      }
      setTotalSupplyList(tempTotalSupply);
    }
  };

  const loadBalanceList = async () => {
    if (!tpfs.isLoading && tpfs?.data?.length > 0 && user?.publicKey) {
      const chunks = _.chunk(tpfs?.data ?? [], rowsPerPage);
      let tempBalance = [];
      for (let index = 0; index < chunks.length; index++) {
        const tpfChunk = chunks[index];
        const balanceSettled = await Promise.allSettled(
          tpfChunk.map((tpf) =>
            balanceOf({
              contractAddress: tpf.asset,
              accountAddress: user.publicKey,
            }).then((balance) => ({
              symbol: tpf.symbol,
              balance
            }))
          )
        );
        tempBalance = balanceSettled.reduce((acc, cur) => {
          if (cur.status !== 'fulfilled') return acc;
          return acc.concat(cur.value);
        }, tempBalance);
      }
      setBalanceList(tempBalance);
    }
  };

  useEffect(() => {
    loadUnitPriceList();
    loadTotalAssetsList();
    loadTotalSupplyList();
    loadBalanceList();
  }, [tpfs]);

  return (
    <>
      {isOpenBuy && <TPFBuy open={isOpenBuy} handleClose={handleCloseBuy} tpf={buyTPF} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4" style={{ fontWeight: 500 }}>
                  Títulos disponíveis
                </Typography>
              </Stack>
              <div>
                {embedded ? (
                  <Link href="/titulo">Ver todos</Link>
                ) : (
                  <Button
                    style={{ borderRadius: '50px', padding: '8px 24px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      if (!tpfs?.isLoading) list();
                    }}
                  >
                    Atualizar
                  </Button>
                )}
              </div>
            </Stack>
            <TPFTable
              embedded={embedded}
              count={tpfs?.data?.length ?? 0}
              items={tpfsPaginated}
              onDeselectAll={tpfsSelection.handleDeselectAll}
              onDeselectOne={tpfsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={tpfsSelection.handleSelectAll}
              onSelectOne={tpfsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={tpfsSelection.selected}
              isLoading={tpfs?.isLoading}
              handleOpenBuy={handleOpenBuy}
              unitPriceList={unitPriceList}
              totalAssetsList={totalAssetsList}
              totalSupplyList={totalSupplyList}
              balanceList={balanceList}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

TPFPage.getLayout = (page) => (
  <DashboardLayout>
    <PageTitle>Títulos disponíveis</PageTitle>
    {page}
  </DashboardLayout>
);

export default TPFPage;
