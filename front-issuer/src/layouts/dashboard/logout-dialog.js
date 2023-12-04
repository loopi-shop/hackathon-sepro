import { Dialog } from '@mui/material';

export const LogoutDialog = ({ open, onCancel, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <div className="div br-modal medium">
        <div className="br-modal-header">Confirmar logout</div>
        <div className="br-modal-body">
          <p>Você deseja realmente fazer logout?</p>
        </div>
        <div className="br-modal-footer justify-content-end">
          <button className="br-button secondary" type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="br-button primary ml-2" type="button" onClick={onConfirm}>
            Sim
          </button>
        </div>
      </div>
    </Dialog>
  );
};
