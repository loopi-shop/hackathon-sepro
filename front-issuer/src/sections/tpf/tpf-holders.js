import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from "@mui/material"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'

export const TPFHolders = ({ tpf, open, handleClose }) => {
  if (!tpf?.symbol) return;
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Clientes - {tpf.symbol}</DialogTitle>
      <DialogContent dividers={'paper'}>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          aria-label="clientes"
        >
          <ListItem disablePadding>
            <ListItemText primary="Chelsea Otakan" />
            <ListItemButton>
              <ListItemIcon>
                <FontAwesomeIcon icon={faLock} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  )
}
