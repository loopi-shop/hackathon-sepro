import { Icon } from '@mui/material';

/**
 * AddressButton component
 * @param {Object} props - Props
 * @param {boolean} [props.icon] - Show icon (optional)
 * @param {string} [props.className] - Class name (optional)
 * @param {React.CSSProperties} [props.style] - Style (optional)
 * @param {Function} props.onClick - Callback function that is called when the button is clicked
 * @param {React.ReactNode} props.children - The child elements to be rendered within the component.
 * @returns {React.Component} An address button component
 */
export function AddressButton({ icon, className, style, onClick, children }) {
  return (
    <button
      className={['br-button', className].join(' ')}
      type="button"
      style={{ ...style, width: '100%' }}
      onClick={onClick}
    >
      {icon && (
        <Icon sx={{ mr: 2, width: '20px', height: '20px' }}>
          <img alt={'Logo metamask'} src={'/assets/logos/logo-metamask.svg'} />
        </Icon>
      )}
      {children}
    </button>
  );
}
