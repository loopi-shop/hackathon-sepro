import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { TokenCard } from '../sections/tokens/token-card';
import {useAuth} from "../hooks/use-auth";
import {RoleEnum} from "../contexts/auth-context";
import { PageTitle } from 'src/components/page-title';

const Page = () => {
  const [account, setAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const { user } = useAuth();

  /* Load Account */
  useEffect(() => {
    if(isLoading || account) return;
    setIsLoading(true);
    if(user.role === RoleEnum.ADMIN) {
      setAccount(user.publicKey);
      setIsLoading(false);
    } else {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0])
          setIsLoading(false);
        })
    }
  });

  /* Load balances */
  useEffect(() => {
    if(isLoading || !account || tokens.length) {
      return;
    }

    setIsLoading(true);
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

    const abi = 'function balanceOf(address) view returns (uint256)';
    const erc20Contract = new ethers.Contract(process.env.NEXT_PUBLIC_BRLX_CONTRACT, [abi], provider);

    Promise.all([
      provider.getBalance(account),
      erc20Contract.balanceOf(account),
    ]).then(([nativeBalance, erc20Balance]) => {
      setTokens([
        { name: 'Matic', quantity: nativeBalance, decimals: 18, linkGetMore: 'https://mumbaifaucet.com/' },
        { name: 'BRLX - Test', quantity: erc20Balance, decimals: 6, isToMint: true },
      ])
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      throw err;
    });
  });

  return (
    <>
      <PageTitle>Lista de tokens</PageTitle>
      <Box component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4" sx={{ mb: 3 }}>
                Tokens
              </Typography>
            </div>
            <div>
              <Grid
                container
                spacing={3}
              >
                { tokens.map((token, index) =>
                  <Grid
                    xs={12}
                    md={6}
                    lg={6}
                    key={index}
                  >
                    <TokenCard token={token} account={account} key={index} />
                  </Grid>
                )}
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;