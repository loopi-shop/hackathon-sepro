import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { TableRowsLoader } from 'src/components/table-rows-loader';
import { useMemo } from 'react';

const tableHeader = {
  acronym: 'Sigla',
  expirationDate: 'Data de vencimento',
  minimumValue: 'Valor mínimo',
  profitability: 'Rentabilidade',
}
const keys = Object.keys(tableHeader);


export const TPFTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    isLoading = false,
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const rows = useMemo(() => {
    return items.map((tpf) => {
      console.log(tpf)
      const isSelected = selected.includes(tpf.id);

      return (
        <TableRow
          hover
          key={tpf.id}
          selected={isSelected}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={isSelected}
              onChange={(event) => {
                if (event.target.checked) {
                  onSelectOne?.(tpf.id);
                } else {
                  onDeselectOne?.(tpf.id);
                }
              }}
            />
          </TableCell>
          {keys.map((key) => (
            <TableCell key={`${key}-${tpf.id}`}>
              {tpf[key]}
            </TableCell>
          ))}
        </TableRow>
      );
    })
  }, [items])

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                {keys.map((key) => (
                  <TableCell key={key}>
                    {tableHeader[key]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRowsLoader rowsNum={3} columnsNum={keys.length + 1} /> : rows}
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
};
