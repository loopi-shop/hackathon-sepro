import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import ShareIcon from '@heroicons/react/24/solid/ShareIcon';
import { Button, CircularProgress, Icon, SvgIcon } from '@mui/material';

export const ItemCard = (unitPriceList, headers, settleLoading, isAdmin, settle, buy) => (item) => {
  const unitPrice = unitPriceList.find((up) => up.symbol === item.symbol)?.price;
  return (
    <div
      key={item.symbol}
      style={{
        boxShadow: '0 1px 6px #33333320',
        width: '100%',
        padding: '16px',
        backgroundColor: 'white'
      }}
      title={item.symbol}
    >
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

        <Icon style={{ width: '32px', height: '32px' }} color="primary">
          <SvgIcon style={{ width: '32px', height: '32px' }}>
            <EllipsisVerticalIcon />
          </SvgIcon>
        </Icon>
      </div>

      <div style={{ display: 'grid', gridTemplate: '1fr', gap: '8px' }}>
        {headers.slice(2).map((header) => (
          <p key={header.key} style={{ margin: 0, padding: 0 }}>
            <b style={{ fontWeight: 700, fontSize: '14px', lineHeight: '20px' }}>
              {header.description}
            </b>
            <br />
            <span style={{ fontSize: '14px', lineHeight: '20px' }}>
              {header.key === 'unitPrice'
                ? !unitPrice
                  ? 'Carregando...'
                  : (unitPrice / 10 ** item.decimals).toFixed(item.decimals)
                : header.format
                ? header.format({ rowData: item, value: item[header.key] })
                : item[header.key]}
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
          >
            {settleLoading[item.symbol] ? <CircularProgress /> : isAdmin ? 'Liquidar' : 'Comprar'}
          </Button>
          <Icon style={{ width: '32px', height: '32px' }} color="primary">
            <SvgIcon style={{ width: '32px', height: '32px' }}>
              <ShareIcon />
            </SvgIcon>
          </Icon>
        </p>
      </div>
    </div>
  );
};
