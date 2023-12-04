import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { TokenCard } from '../sections/tokens/token-card';
import { useAuth } from '../hooks/use-auth';
import { PageTitle } from 'src/components/page-title';
import { CardsList } from 'src/components/cards';

export const WalletPage = ({ embedded }) => {
  const [account, setAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const { user, isAdmin } = useAuth();

  /* Load Account */
  useEffect(() => {
    if (isLoading || account) return;
    setIsLoading(true);
    if (isAdmin) {
      setAccount(user.publicKey);
      setIsLoading(false);
    } else {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        setAccount(accounts[0]);
        setIsLoading(false);
      });
    }
  });

  /* Load balances */
  useEffect(() => {
    if (isLoading || !account || tokens.length) {
      return;
    }

    setIsLoading(true);
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

    const abi = 'function balanceOf(address) view returns (uint256)';
    const erc20Contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_BRLX_CONTRACT,
      [abi],
      provider
    );

    Promise.all([provider.getBalance(account), erc20Contract.balanceOf(account)])
      .then(([nativeBalance, erc20Balance]) => {
        setTokens([
          {
            name: 'Matic',
            quantity: nativeBalance,
            decimals: 18,
            linkGetMore: 'https://mumbaifaucet.com/'
          },
          { name: 'BRLX - Test', quantity: erc20Balance, decimals: 6, isToMint: true }
        ]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={embedded ? 'xl' : 'lg'}>
        <Stack spacing={3}>
          <div>
            <Typography variant="h4" style={{ fontWeight: 500 }}>
              {isAdmin ? 'Carteira ADMIN' : 'Minha carteira'}
            </Typography>
          </div>
          <div>
            <CardsList>
              {tokens.map((token, index) => (
                <TokenCard token={token} account={account} key={index} />
              ))}
            </CardsList>
          </div>
        </Stack>
      </Container>
    </Box>
  );
};

WalletPage.getLayout = (page) => (
  <DashboardLayout>
    <PageTitle>Minha carteira</PageTitle>
    {page}
  </DashboardLayout>
);

export default WalletPage;
