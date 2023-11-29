import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Link, Typography } from '@mui/material';
import { ethers } from "ethers";
import { useState } from 'react';

export const TokenCard = ({ token, account }) => {
  const [isLoading, setIsLoading] = useState(false);
  const mintBRLX = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const abi = 'function mint(address, uint256)';
    const erc20Contract = new ethers.Contract('0xbeb1984c961c786d52c5112f72276958c738699d', [abi], await provider.getSigner());
    setIsLoading(true);

    const transaction = await erc20Contract.mint(account, 1000 * 10 ** 6)
      .catch(err => {
        console.error(err);
        throw err;
      });
    await transaction.wait(5);
    setIsLoading(false);
    window.location.reload();
  }

  const formatTokenQuantity = (quantity, decimals) => {
    if (quantity === 0n) {
      return '0.0';
    }

    quantity = quantity.toString();
    decimals = decimals.toString();

    const offset = quantity.length - decimals;
    return `${quantity.slice(0, offset)}.${quantity.slice(offset)}`;
  }

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {token.name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Balance: {formatTokenQuantity(token.quantity, token.decimals)}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        {
          token.isToMint
            ? (
              <Button
                fullWidth
                variant="text"
                onClick={mintBRLX}
              >
                Mint +1000
              </Button>
            )
            : (
              <Link
                sx={{textAlign: 'center', width: '100%'}}
                href={token.linkGetMore}
                target={'_blank'}
                className={'MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-fullWidth MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-fullWidth css-ir6wn7-MuiButtonBase-root-MuiButton-root'}
              >
                Get More
              </Link>
            )
        }
      </CardActions>
    </Card>
  );
}