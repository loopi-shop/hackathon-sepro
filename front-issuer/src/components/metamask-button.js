import { Button, Icon } from "@mui/material";

export function MetamaskButton({ connect, connected, account }) {
  return (
    <Button fullWidth size="large" onClick={connect}>
      <Icon sx={{ mr: 2, width: "40px", height: "40px" }}>
        <img alt={"Logo metamask"} src={"/assets/logos/logo-metamask.svg"} />
      </Icon>
      {connected && account ? `Conectado com: ${account}` : "Conectar com a Metamask"}
    </Button>
  );
}
