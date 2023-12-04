import { faEllipsisVertical, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { Input } from 'src/components/input';
import { Scrollbar } from 'src/components/scrollbar';
import { useBuyOrders } from 'src/hooks/secondary-market/use-buy-orders';
import { formatBRLX } from 'src/utils/format';

const headers = [
  {
    key: 'name',
    title: 'Título'
  },
  {
    key: 'expirationDate',
    title: 'Data de vencimento'
  },
  {
    key: 'yield',
    title: 'Rentabilidade '
  },
  {
    key: 'unitPrice',
    title: 'Preço unitário (BRLX)',
    format: formatBRLX
  },
  {
    key: 'quantity',
    title: 'Quantidade'
  },
  {
    key: 'totalPrice',
    title: 'Valor do lote (BRLX)',
    format: formatBRLX
  },
  {
    key: 'sellPrice',
    title: 'Preço de venda (BRLX)',
    format: formatBRLX
  }
];

export function MyBuyOrders() {
  const { orders, removeOrder, search, setSearch, searchOpen, setSearchOpen } = useBuyOrders();

  return (
    <Box sx={{ mb: 5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1
        }}
      >
        <Typography variant="h6" sx={{ textTransform: 'none', pl: '16px' }}>
          Ordens de compra
        </Typography>
        <Box>
          {searchOpen ? (
            <Input
              autoFocus
              style={{ display: 'inline-block' }}
              iconClass="fas fa-search"
              value={search}
              onChange={(ev) => setSearch(ev.currentTarget.value)}
              onBlur={() => setSearchOpen(false)}
            ></Input>
          ) : (
            <IconButton onClick={() => setSearchOpen(true)}>
              <SvgIcon fontSize="small" color="primary">
                <FontAwesomeIcon icon={faSearch} />
              </SvgIcon>
            </IconButton>
          )}
          <IconButton>
            <SvgIcon fontSize="small" color="primary">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </SvgIcon>
          </IconButton>
        </Box>
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((head, index) => (
                  <TableCell key={index}>{head.title}</TableCell>
                ))}
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow index={index} key={index}>
                  {headers.map((head, insideIndex) => (
                    <TableCell sx={{ fontSize: '14px' }} key={insideIndex}>
                      {head.format ? head.format(order[head.key]) : order[head.key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton
                      color={'primary'}
                      onClick={() => removeOrder(order)}
                      title="Remover"
                    >
                      <SvgIcon fontSize="small">
                        <FontAwesomeIcon icon={faTrash} />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Box>
  );
}
