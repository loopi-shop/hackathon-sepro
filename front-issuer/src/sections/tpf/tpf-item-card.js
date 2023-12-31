import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCartShopping,
  faWallet
} from '@fortawesome/free-solid-svg-icons';
import { Button, CircularProgress, Divider, IconButton, SvgIcon } from '@mui/material';
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
    openHolders
  }) =>
  (item) => {
    const itemComplement = {
      unitPrice: unitPriceList.find((up) => up.symbol === item.symbol)?.price,
      totalAssets: totalAssetsList.find((up) => up.symbol === item.symbol)?.totalAssets,
      totalSupply: totalSupplyList.find((up) => up.symbol === item.symbol)?.totalSupply,
      balance: balanceList.find((up) => up.symbol === item.symbol)?.balance
    };
    const holders = () => {
      console.log(`Show holders list of token ${item.contractAddress}`);
      openHolders(item);
    };

    const withdraw = () => {
      console.log(`Withdraw of token ${item.contractAddress}`);
      handleOpenWithdraw(item);
    };

    const expirationHeader = headers.filter((h) => h.key === 'expirationDate')[0];
    const balanceHeader = headers.filter((h) => h.key === 'balance')[0];
    let othersHeaders = headers.filter(
      (h) => !['symbol', 'expirationDate', isAdmin ? 'x' : 'balance'].includes(h.key)
    );

    if (!isAdmin) {
      othersHeaders = othersHeaders.reverse();
    }

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
              Vencimento {expirationHeader?.format({ rowData: item }) ?? 'não informado'}
            </p>
          </div>
        </div>
        {!isAdmin && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 0 8px',
                gap: '9px'
              }}
            >
              <IconButton style={{ width: '20px', height: '20px' }} color="inherit">
                <SvgIcon fontSize="medium" style={{ width: '20px', height: '20px' }}>
                  <FontAwesomeIcon icon={faWallet} />
                </SvgIcon>
              </IconButton>
              <div>
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '20px',
                    margin: 0,
                    padding: 0,
                    textTransform: 'uppercase'
                  }}
                >
                  Meu Saldo
                </h2>
                <p style={{ margin: 0, padding: 0, fontSize: '14px', lineHeight: '20px' }}>
                  {balanceHeader?.format({ rowData: item, value: itemComplement['balance'] })}
                </p>
              </div>
            </div>
            <Divider sx={{ mb: 1 }} />
          </>
        )}

        <div style={{ display: 'grid', gridTemplate: '1fr', gap: '8px' }}>
          {othersHeaders.map((header) => (
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

          <div
            style={{
              margin: 0,
              padding: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                color="primary"
                variant="contained"
                style={{ borderRadius: '50px', maxWidth: 'fit-content' }}
                onClick={() => (isAdmin ? settle(item) : buy(item))}
                startIcon={
                  !isAdmin && (
                    <SvgIcon fontSize="small">
                      <FontAwesomeIcon icon={faCartShopping} />
                    </SvgIcon>
                  )
                }
              >
                {settleLoading[item.symbol] && <CircularProgress size={24} sx={{ mr: 1 }} />}
                {isAdmin ? 'Liquidar' : 'Comprar'}
              </Button>
              {isAdmin && (
                <Button
                  color="primary"
                  variant="outlined"
                  style={{ borderRadius: '50px', marginLeft: '5px', maxWidth: 'fit-content' }}
                  onClick={withdraw}
                >
                  Sacar
                </Button>
              )}
            </div>
            {isAdmin && (
              <IconButton color="primary" style={{ cursor: 'pointer' }} onClick={holders}>
                <SvgIcon fontSize="medium">
                  <FontAwesomeIcon icon={faUsers} />
                </SvgIcon>
              </IconButton>
            )}
          </div>
        </div>
      </CardItem>
    );
  };
