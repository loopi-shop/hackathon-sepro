import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import { TokenCard } from '../sections/tokens/token-card';

const tokens = [
  { name: 'Matic', quantity: '2.100', linkGetMore: 'https://mumbaifaucet.com/' },
  { name: 'BRLX - Test', quantity: '20.100', isToMint: true },
]

const Page = () => {
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [tokens, setTokens] = useState([]);

  /* Load Account */
  useEffect(() => {
    if(isLoading || account) return;
    setIsLoading(true);
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log('accounts',accounts);
        setAccount(accounts[0])
        setIsLoading(false);
      })
  });

  const getBalance = () => {
    const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

    const balanceERC20Abi = {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    };

  }

  return (
    <>
      <Head>
        <title>
          Mint BRLX - TEST | Devias Kit
        </title>
      </Head>
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
                { tokens.map(token =>
                  <Grid
                    xs={12}
                    md={6}
                    lg={6}
                  >
                    <TokenCard token={token} account={account} />
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