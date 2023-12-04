import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faEllipsisV,
  faCartShopping,
  faShareNodes
} from '@fortawesome/free-solid-svg-icons';
import { Button, CircularProgress, IconButton, SvgIcon } from '@mui/material';
import { CardItem } from 'src/components/cards';

export const TPFItemCard =
  ({
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
  }) =>
    (item) => {
      const itemComplement = {
        totalAssets: unitPriceList.find((up) => up.symbol === item.symbol)?.price,
        totalSupply: totalAssetsList.find((up) => up.symbol === item.symbol)?.totalAssets,
        balance: totalSupplyList.find((up) => up.symbol === item.symbol)?.totalSupply,
        unitPrice: balanceList.find((up) => up.symbol === item.symbol)?.balance
      };
      const holders = () => {
        console.log(`Show holders list of token ${item.contractAddress}`);
      };

      const withdraw = () => {
        console.log(`Withdraw of token ${item.contractAddress}`);
        handleOpenWithdraw(item);
      };

      return (
        <CardItem key={item.symbol} title={item.symbol}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0 8px'
            }}
          >
            <div>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '28px',
                  margin: 0,
                  padding: 0
                }}
              >
                {item.name}
              </h2>
              <p style={{ margin: 0, padding: 0, fontSize: '12px', lineHeight: '16px' }}>
                Vencimento {headers[1].format({ rowData: item })}
              </p>
            </div>

            <IconButton style={{ width: '32px', height: '32px' }} color="primary">
              <SvgIcon fontSize="medium" style={{ width: '24px', height: '24px' }}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </SvgIcon>
            </IconButton>
          </div>

          <div style={{ display: 'grid', gridTemplate: '1fr', gap: '8px' }}>
            {headers.slice(2).map((header) => (
              <p key={header.key} style={{ margin: 0, padding: 0 }}>
                <b style={{ fontWeight: 700, fontSize: '14px', lineHeight: '20px' }}>
                  {header.description}
                </b>
                <br />
                <span style={{ fontSize: '14px', lineHeight: '20px' }}>
                  {header.format
                    ? header.format({
                      rowData: item,
                      value: item[header.key] ?? itemComplement[header.key]
                    })
                    : item[header.key] ?? itemComplement[header.key]}
                </span>
              </p>
            ))}

            <p
              style={{
                margin: 0,
                padding: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Button
                color="primary"
                variant="contained"
                style={{ borderRadius: '50px', maxWidth: 'fit-content' }}
                onClick={() => (isAdmin ? settle(item) : buy(item))}
                startIcon={
                  <SvgIcon fontSize="small">
                    <FontAwesomeIcon icon={faCartShopping} />
                  </SvgIcon>
                }
              >
                {settleLoading[item.symbol] && <CircularProgress size={24} sx={{ mr: 1 }} />}
                {isAdmin ? 'Liquidar' : 'Comprar'}
              </Button>
              <IconButton
                color="primary"
                style={{ cursor: 'pointer' }}
                onClick={isAdmin ? holders : withdraw}
              >
                <SvgIcon fontSize='medium'>
                  <FontAwesomeIcon icon={isAdmin ? faUsers : faShareNodes} />
                </SvgIcon>
              </IconButton>
            </p>
          </div>
        </CardItem>
      );
    };
