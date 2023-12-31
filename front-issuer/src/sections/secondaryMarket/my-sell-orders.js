import { faEllipsisVertical, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
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
import { Scrollbar } from 'src/components/scrollbar';
import { useSellOrders } from 'src/hooks/secondary-market/use-sell-orders';
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
    key: 'quantity',
    title: 'Quantidade'
  },
  {
    key: 'sellPrice',
    title: 'Preço de venda (BRLX)',
    format: formatBRLX
  }
];

export function MySellOrders() {
  const { orders, buyOrder } = useSellOrders();

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
          Ordens de venda
        </Typography>
        <Box>
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
                      onClick={() => buyOrder(order)}
                      title="Comprar"
                    >
                      <SvgIcon fontSize="small">
                        <FontAwesomeIcon icon={faShoppingCart} />
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