import { createTheme as createMuiTheme } from '@mui/material';
import { createPalette } from './create-palette';
import { createComponents } from './create-components';
import { createShadows } from './create-shadows';
import { createTypography } from './create-typography';

export function createTheme() {
  const base = {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440
      }
    },
    shape: {
      borderRadius: 8
    },
  };
  const baseTheme = createMuiTheme(base);

  const palette = createPalette();
  const components = createComponents({ palette });
  const shadows = createShadows();
  const typography = createTypography(baseTheme);

  const theme = createMuiTheme({
    ...base,
    components,
    palette,
    shadows,
    typography,
  });

  return theme;
}
