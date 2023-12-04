import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Icon,
  Link,
  SvgIcon,
  Typography
} from '@mui/material';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { RoleEnum } from '../../contexts/auth-context';
import { useSnackbar } from 'notistack';
import { CardItem } from 'src/components/cards';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';

export const TokenCard = ({ token, account }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  const mintBRLX = async () => {
    const signer =
      isAdmin
        ? new ethers.Wallet(
            process.env.NEXT_PUBLIC_ADM_PRIVATE_KEY,
            new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
          )
        : await new ethers.BrowserProvider(window.ethereum).getSigner();

    const abi = 'function mint(address, uint256)';
    const erc20Contract = new ethers.Contract(process.env.NEXT_PUBLIC_BRLX_CONTRACT, [abi], signer);
    setIsLoading(true);

    const transaction = await erc20Contract.mint(account, 1000 * 10 ** 6).catch((err) => {
      console.error(`mint:`, err);
      enqueueSnackbar(`Erro ao adicionar BRLX (${process.env.NEXT_PUBLIC_BRLX_CONTRACT})`, {
        variant: 'error'
      });
      return null;
    });
    setIsLoading(false);
    if (transaction) {
      await transaction.wait(5);
      window.location.reload();
    }
  };

  const formatTokenQuantity = (quantity, decimals) => {
    if (quantity === 0n) {
      return '0.00';
    }

    quantity = quantity.toString();
    decimals = decimals.toString();

    const offset = quantity.length - decimals;
    return `${quantity.slice(0, offset)}.${quantity.slice(offset)}`;
  };

  return (
    <CardItem>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mb: 3
          }}
        >
          <Avatar
            sx={{
              height: 54,
              width: 54
            }}
            src={`assets/logos/logo-${token.isToMint ? 'brlx' : 'matic'}.png`}
          />
          <Box sx={{ ml: 2, width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 0, pb: 0 }}>
              {token.name}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 12 }}>
              Saldo na carteira {token.name}
            </Typography>
          </Box>
          <Icon style={{ width: '32px', height: '32px' }} color="primary">
            <SvgIcon fontSize="medium" style={{ width: '24px', height: '24px' }}>
              <EllipsisVerticalIcon />
            </SvgIcon>
          </Icon>
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: '20px', m: 0, p: 0 }}>
          Saldo
        </Typography>
        <Typography sx={{ fontSize: 14, lineHeight: '20px', m: 0, p: 0 }}>
          {formatTokenQuantity(token.quantity, token.decimals)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="outlined"
          style={{ borderRadius: '50px', maxWidth: 'fit-content' }}
          onClick={() => (token.isToMint ? mintBRLX() : window.open(token.linkGetMore, '_blank'))}
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Icon style={{ width: '28px', height: '28px' }} color="primary">
                <SvgIcon fontSize="medium" style={{ width: '24px', height: '24px' }}>
                  <PlusIcon />
                </SvgIcon>
              </Icon>
            )
          }
        >
          Adicionar
        </Button>
      </CardActions>
    </CardItem>
  );
};
