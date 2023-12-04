import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { enqueueSnackbar } from 'notistack';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useTPF } from '../../hooks/use-tpf';

export const TPFHolders = ({ open, handleClose, tpf, holders, setHolders }) => {
  if (!tpf?.symbol) return;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Clientes - {tpf.symbol}</DialogTitle>
      <DialogContent dividers={'paper'}>
        <List
          sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}
          aria-label="clientes"
        >
          {holders.length
            ? holders.map((holder) => TPFHolder(holder, setHolders, tpf))
            : 'Nenhum cliente encontrado'}
        </List>
      </DialogContent>
    </Dialog>
  );
};

const TPFHolder = (holder, setHolders, tpf) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { broadcast, setFrozen } = useTPF();

  const handleFrozen = async (holder) => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      console.info(`Congelando Cliente [${holder.publicKey}] para o TPF:`, tpf);
      const tx = await setFrozen({
        contractAddress: tpf.contractAddress,
        frozen: !holder.isFrozen,
        walletAddress: holder.publicKey
      });
      console.info(`tx:setAddressFrozen:`, tx);
      const { txHash } = await broadcast({ tx });
      enqueueSnackbar(`Transação: ${txHash}`, { variant: 'info' });

      setHolders((old) => {
        const target = old.find((oldHolder) => oldHolder.publicKey === holder.publicKey);
        target.isFrozen = !holder.isFrozen;
        return [...old];
      });
    } catch (error) {
      console.error(`frozenHolder:`, error);
      enqueueSnackbar(`Erro ao congelar cliente ${holder.publicKey} para o token ${tpf.symbol}`, {
        variant: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ListItem key={holder.publicKey} disablePadding>
      <ListItemText
        primary={holder.publicKey}
        sx={{ color: holder.isFrozen ? '#D83933' : undefined }}
      />
      {isProcessing ? (
        <CircularProgress size={20} sx={{ marginLeft: '8px' }} />
      ) : (
        <ListItemButton
          sx={{ color: holder.isFrozen ? '#D83933' : undefined }}
          onClick={() => handleFrozen(holder)}
        >
          <FontAwesomeIcon icon={holder.isFrozen ? faLock : faLockOpen} />
        </ListItemButton>
      )}
    </ListItem>
  );
};
