import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Icon,
  Link,
  SvgIcon,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { RoleEnum } from "../../contexts/auth-context";
import { useSnackbar } from "notistack";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";

export const TokenCard = ({ token, account }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const mintBRLX = async () => {
    const signer =
      user.role === RoleEnum.ADMIN
        ? new ethers.Wallet(
            process.env.NEXT_PUBLIC_ADM_PRIVATE_KEY,
            new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
          )
        : await new ethers.BrowserProvider(window.ethereum).getSigner();

    const abi = "function mint(address, uint256)";
    const erc20Contract = new ethers.Contract(process.env.NEXT_PUBLIC_BRLX_CONTRACT, [abi], signer);
    setIsLoading(true);

    const transaction = await erc20Contract.mint(account, 1000 * 10 ** 6).catch((err) => {
      console.error(`mint:`, err);
      enqueueSnackbar(`Erro no mint para ${process.env.NEXT_PUBLIC_BRLX_CONTRACT}`, {
        variant: "error",
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
      return "0.0";
    }

    quantity = quantity.toString();
    decimals = decimals.toString();

    const offset = quantity.length - decimals;
    return `${quantity.slice(0, offset)}.${quantity.slice(offset)}`;
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          <Typography gutterBottom variant="h5">
            {token.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Balance: {formatTokenQuantity(token.quantity, token.decimals)}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        {isLoading ? (
          <Button fullWidth disabled>
            <Icon sx={{ mr: 2, width: "40px", height: "40px" }}>
              <SvgIcon>
                <ArrowPathIcon />
              </SvgIcon>
            </Icon>
          </Button>
        ) : token.isToMint ? (
          <Button fullWidth variant="text" onClick={mintBRLX}>
            Mint +1000
          </Button>
        ) : (
          <Link
            sx={{ textAlign: "center", width: "100%" }}
            href={token.linkGetMore}
            target={"_blank"}
            className={
              "MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-fullWidth MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-fullWidth css-ir6wn7-MuiButtonBase-root-MuiButton-root"
            }
          >
            Get More
          </Link>
        )}
      </CardActions>
    </Card>
  );
};
