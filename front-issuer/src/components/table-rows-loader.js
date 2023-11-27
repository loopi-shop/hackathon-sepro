import {
  TableCell,
  TableRow,
  Skeleton,
} from '@mui/material';

export const TableRowsLoader = ({ rowsNum, columnsNum }) => {
  return [...Array(rowsNum)].map((row, index) => (
    <TableRow key={index}>
      {[...Array(columnsNum)].map((column, index) => (
        <TableCell component="th" scope="row" key={index}>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      ))}
    </TableRow>
  ));
};