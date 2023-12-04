import { Icon } from '@mui/material';

/**
 * MetaMaskButton component
 * @param {Object} props - Props
 * @param {string} [props.className] - Class name (optional)
 * @param {React.CSSProperties} [props.style] - Style (optional)
 * @param {Function} props.onClick - Callback function that is called when the button is clicked
 * @returns {React.Component} A MetaMaskButton component
 */
export function MetaMaskButton({ className, style, onClick }) {
  return (
    <button
      className={['br-button secondary', className].join(' ')}
      type="button"
      style={{ ...style, width: '100%' }}
      onClick={onClick}
    >
      <Icon sx={{ mr: 2, width: '20px', height: '22px' }}>
        <img alt={'Logo metamask'} src={'/assets/logos/logo-metamask.svg'} />
      </Icon>
      Conectar com MetaMask
    </button>
  );
}
