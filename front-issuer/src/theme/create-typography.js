/**
 * @param {import('@mui/material/styles/createTheme').Theme} theme
 * @returns {import('@mui/material/styles/createTypography').TypographyOptions}
 */
export const createTypography = (theme) => {
  const fontSizeBasePx = '14px';
  const fontSizeScaleDown01 = multiplyFontSize(fontSizeBasePx, 'px', 0.833);
  const fontSizeScaleDown02 = multiplyFontSize(fontSizeBasePx, 'px', 0.694);
  const fontSizeScaleDown03 = multiplyFontSize(fontSizeBasePx, 'px', 0.579);
  const fontSizeScaleUp01 = multiplyFontSize(fontSizeBasePx, 'px', 1.2);
  const fontSizeScaleUp02 = multiplyFontSize(fontSizeBasePx, 'px', 1.44);
  const fontSizeScaleUp03 = multiplyFontSize(fontSizeBasePx, 'px', 1.728);
  const fontSizeScaleUp04 = multiplyFontSize(fontSizeBasePx, 'px', 2.074);
  const fontSizeScaleUp05 = multiplyFontSize(fontSizeBasePx, 'px', 2.488);
  const fontSizeScaleUp06 = multiplyFontSize(fontSizeBasePx, 'px', 2.986);
  const fontSizeScaleUp07 = multiplyFontSize(fontSizeBasePx, 'px', 3.583);
  const fontSizeScaleUp08 = multiplyFontSize(fontSizeBasePx, 'px', 4.3);
  const fontSizeScaleUp09 = multiplyFontSize(fontSizeBasePx, 'px', 5.16);
  const fontSizeScaleUp10 = multiplyFontSize(fontSizeBasePx, 'px', 6.192);
  const fontSizeScaleUp11 = multiplyFontSize(fontSizeBasePx, 'px', 7.43);
  return {
    fontFamily: 'Rawline, "Raleway", sans-serif',
    fontSize: fontSizeBasePx,
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57
    },
    button: {
      fontWeight: 600
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.66
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.57
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 2.5,
      textTransform: 'uppercase'
    },
    h1: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: 700,
      fontSize: fontSizeScaleUp04,
      lineHeight: 1.2,
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp06,
      },
    },
    h2: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: 700,
      fontSize: fontSizeScaleUp03,
      lineHeight: 1.2,
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp05,
      },
    },
    h3: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: 700,
      fontSize: fontSizeScaleUp03,
      lineHeight: 1.2,
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp04,
      },
    },
    h4: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: 700,
      fontSize: fontSizeScaleUp01,
      lineHeight: 1.2,
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp03,
      },
    },
    h5: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: 700,
      fontSize: fontSizeBasePx,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp02,
      },
    },
    h6: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: 700,
      fontSize: fontSizeScaleDown01,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp01,
      },
    }
  };
};

function multiplyFontSize(font, unit, multiplyBy) {
  const fontSize = Number(font.replace(unit, ''));
  return `${fontSize * multiplyBy}${unit}`;
}
