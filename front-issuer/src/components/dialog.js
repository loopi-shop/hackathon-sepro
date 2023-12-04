import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import { Dialog, Icon, Paper, Slide, SvgIcon } from '@mui/material';
import { forwardRef } from 'react';

export function CustomDialog({ title, open, handleClose, children }) {
  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      PaperComponent={CustomPaper}
    >
      <div style={{ fontSize: '20px', fontWeight: 600 }}>
        {title}
        <Icon
          style={{ float: 'right', width: 40, height: 40, coloer: 'navy', cursor: 'pointer' }}
          onClick={handleClose}
        >
          <SvgIcon>
            <XMarkIcon />
          </SvgIcon>
        </Icon>
      </div>
      {children}
    </Dialog>
  );
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const CustomPaper = forwardRef(function CustomPaper(props, ref) {
  return <Paper ref={ref} style={{ borderRadius: 0, padding: '16px' }} {...props} />;
});
