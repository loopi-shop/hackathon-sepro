import { BRLX_DECIMALS } from 'src/constants';

const brlxFormatter = new Intl.NumberFormat('pt-BR', {
  minimumIntegerDigits: 1,
  minimumFractionDigits: BRLX_DECIMALS,
  maximumFractionDigits: BRLX_DECIMALS
});
export function formatBRLX(value) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  return brlxFormatter.format(value);
}
