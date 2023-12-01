import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import _ from 'lodash';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TPFTable } from 'src/sections/tpf/tpf-table';
import { TPFBuy } from 'src/sections/tpf/tpf-buy';
import { applyPagination } from 'src/utils/apply-pagination';
import { useTPF } from 'src/hooks/use-tpf';
import { PageTitle } from 'src/components/page-title';

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

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [unitPriceList, setUnitPriceList] = useState([]);
  const { list, tpfs, getPrice } = useTPF();
  const tpfsPaginated = useTPFs(page, rowsPerPage, tpfs?.data ?? []);
  const tpfIds = useTPFIds(tpfsPaginated);
  const tpfsSelection = useSelection(tpfIds);

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

  useEffect(() => {
    loadUnitPriceList();
  }, [tpfs]);

  return (
    <>
      <PageTitle>Títulos disponíveis</PageTitle>
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
              </div>
            </Stack>
            <TPFTable
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
