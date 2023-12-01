import { useSnackbar } from 'notistack';

export const useMessage = () => {
  const { enqueueSnackbar } = useSnackbar();

  return {
    showSuccess: (message, { title } = {}) =>
      enqueueSnackbar(message, { variant: 'success', title }),
    showInfo: (message, { title } = {}) => enqueueSnackbar(message, { variant: 'info', title }),
    showWarning: (message, { title } = {}) =>
      enqueueSnackbar(message, { variant: 'warning', title }),
    showDanger: (message, { title } = {}) => enqueueSnackbar(message, { variant: 'danger', title })
  };
};
