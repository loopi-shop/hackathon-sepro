import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, ListItemButton } from "@mui/material"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { useTPF } from "../../hooks/use-tpf";
import { enqueueSnackbar } from "notistack";

export const TPFHolders = ({ open, handleClose, tpf, holders, setHolders }) => {
  if (!tpf?.symbol) return;

  const { broadcast, setFrozen } = useTPF();

  const handleFrozen = async (holder) => {
    try {
      console.info(`Congelando Cliente [${holder.publicKey}] para o TPF:`, tpf);
      const tx = await setFrozen({
        contractAddress: tpf.contractAddress,
        frozen: !holder.isFrozen,
        walletAddress: holder.publicKey,
      });
      console.info(`tx:setAddressFrozen:`, tx);
      const { txHash } = await broadcast({ tx });
      enqueueSnackbar(`Transação de congelamento: ${txHash}`, {
        variant: 'info',
      });

      setHolders((old) => {
        old.find(oldHolder => oldHolder.publicKey === holder.publicKey).isFrozen = !holder.isFrozen;
        return old;
      });
    } catch (error) {
      console.error(`frozenHolder:`, error);
      enqueueSnackbar(`Erro ao congelar cliente ${holder.publicKey} para o token ${tpf.symbol}`, {
        variant: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Clientes - {tpf.symbol}</DialogTitle>
      <DialogContent dividers={'paper'}>
        <List
          sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}
          aria-label="clientes"
        >
          {holders.map((holder) => (
            <ListItem key={holder.publicKey} disablePadding>
              <ListItemText primary={holder.publicKey} />
              <ListItemButton onClick={() => handleFrozen(holder)}>
                <FontAwesomeIcon icon={holder.isFrozen ? faLock : faLockOpen} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}
