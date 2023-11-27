import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TPFTable } from 'src/sections/tpf/tpf-table';
import { applyPagination } from 'src/utils/apply-pagination';
import { useTPF } from 'src/hooks/use-tpf';


const useTPFs = (page, rowsPerPage, data) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage, data]
  );
};

const useTPFIds = (tpfs) => {
  return useMemo(
    () => {
      return tpfs.map((tpf) => tpf.id);
    },
    [tpfs]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { list, tpfs } = useTPF();
  const tpfsPaginated = useTPFs(page, rowsPerPage, tpfs?.data ?? []);
  const tpfIds = useTPFIds(tpfsPaginated);
  const tpfsSelection = useSelection(tpfIds);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>
          TPF | Lista de títulos
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Títulos
                </Typography>
              </Stack>
              <div>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <ArrowPathIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;