import { forwardRef } from 'react';
import { SnackbarContent, closeSnackbar } from 'notistack';

const ICON_CLASSES = {
  success: 'fas fa-check-circle fa-lg',
  info: 'fas fa-info-circle fa-lg',
  warning: 'fas fa-exclamation-triangle fa-lg',
  danger: 'fas fa-times-circle fa-lg'
};

export const Message = forwardRef(({ variant, title, message, id, ...otherProps }, ref) => {
  return (
    <SnackbarContent {...otherProps} ref={ref} role="alert">
      <div className={`br-message ${variant || 'success'}`}>
        <div className="icon">
          <i className={ICON_CLASSES[variant || 'success']} aria-hidden="true"></i>
        </div>
        <div className="content">
          {title && (
            <>
              <span className="message-title">{title || ''}</span>{' '}
            </>
          )}
          <span className="message-body">{message || ''}</span>
        </div>
        <div className="close">
          <button
            className="br-button circle small"
            type="button"
            aria-label="Fechar"
            onClick={() => closeSnackbar(id)}
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </SnackbarContent>
  );
});
