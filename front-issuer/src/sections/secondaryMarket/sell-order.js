import { CustomDialog } from 'src/components/dialog';

export function SellOrder({ open, handleClose }) {
  return (
    <CustomDialog
      title="Vender Título Público"
      open={open}
      handleClose={handleClose}
    ></CustomDialog>
  );
}
