import { useSDK } from '@metamask/sdk-react';
import { Button, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { AddressButton } from 'src/components/address-button';
import { CustomDialog } from 'src/components/dialog';
import { Input } from 'src/components/input';
import { Select } from 'src/components/select';
import { useSellOrder } from 'src/hooks/secondary-market/user-sell-order';
import { shortenAddress } from 'src/utils/shorten-address';

export function SellOrder({ open, handleClose }) {
  const { account } = useSDK();
  const { options, values, setValue, totalAssets, unitPrice } = useSellOrder();

  return (
    <CustomDialog title="Vender Título Público" open={open} handleClose={handleClose}>
      <AddressButton>{shortenAddress(account, 16, 15)}</AddressButton>
      <Box sx={{ display: 'grid', gap: '8px', mt: 2 }}>
        <Select
          name="asset"
          label="Escolha o Ativo"
          options={options}
          onOptionSelected={(id) => setValue('asset', id)}
        />
        <Box>
          <Input
            name="quantity"
            label="Quantos você quer vender?"
            value={values.quantity}
            type="number"
            onChange={(ev) => setValue('quantity', ev.currentTarget.value)}
            min="1"
          />
          Você possui: {totalAssets} na carteira
        </Box>
        <Box>
          <Input
            name="totalPrice"
            label="Qual o preço do lote?"
            value={values.totalPrice}
            onChange={(ev) => setValue('totalPrice', ev.currentTarget.value)}
            type="number"
            min="1"
          />
          Valor unitário: {unitPrice} BRLX
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Button
        variant="contained"
        color="primary"
        sx={{ borderRadius: '50px', padding: '8px 24px' }}
      >
        Vender
      </Button>
    </CustomDialog>
  );
}
