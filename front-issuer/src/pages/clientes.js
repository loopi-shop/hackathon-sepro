import { useCallback, useEffect, useMemo, useState } from 'react';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import usersRepository from '../repositories/users.repository';
import { PageTitle } from 'src/components/page-title';

const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useCustomerIds = (customers) => {
  return useMemo(() => {
    return customers.map((customer) => customer.id);
  }, [customers]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (isLoading) return;
    setIsLoading(true);
    usersRepository.list().then((list) => {
      setCustomers(list ?? []);
    });
  }, []);

  const customersPaginated = useCustomers(customers, page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack spacing={2}>
            <Typography variant="h4">Clientes</Typography>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Button
                  fontSize="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: '50px' }}
                >
                  Importar
                </Button>
                <Button
                  fontSize="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: '50px' }}
                >
                  Exportar
                </Button>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  sx={{ borderRadius: '50px' }}
                >
                  Adicionar
                </Button>
              </div>
            </Stack>
          </Stack>
        </Stack>
        <CustomersSearch />
        <CustomersTable
          count={customers.length}
          items={customersPaginated}
          onDeselectAll={customersSelection.handleDeselectAll}
          onDeselectOne={customersSelection.handleDeselectOne}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onSelectAll={customersSelection.handleSelectAll}
          onSelectOne={customersSelection.handleSelectOne}
          page={page}
          rowsPerPage={rowsPerPage}
          selected={customersSelection.selected}
        />
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <PageTitle>Clientes</PageTitle>
    {page}
  </DashboardLayout>
);

export default Page;
