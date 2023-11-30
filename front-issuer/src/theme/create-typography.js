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

  const fontWeightThin = 100;
  const fontWeightExtraLight = 200;
  const fontWeightLight = 300;
  const fontWeightRegular = 400;
  const fontWeightMedium = 500;
  const fontWeightSemiBold = 600;
  const fontWeightBold = 700;
  const fontWeightExtraBold = 800;
  const fontWeightBlack = 900;

  const fontLineHeightLow = 1.15;
  const fontLineHeightMedium = 1.45;
  const fontLineHeightHigh = 1.85;

  return {
    fontFamily: 'Rawline, "Raleway", sans-serif',
    fontSize: fontSizeBasePx,
    htmlFontSize: fontSizeBasePx,
    fontWeightBold,
    fontWeightLight,
    fontWeightMedium,
    fontWeightRegular,
    body1: {
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.57
    },
    button: {
      fontSize: fontSizeScaleUp01,
      fontWeight: fontWeightSemiBold,
    },
    caption: {
      fontWeight: 500,
      lineHeight: 1.66
    },
    subtitle1: {
      fontWeight: 500,
      lineHeight: 1.57
    },
    subtitle2: {
      fontWeight: 500,
      lineHeight: 1.57
    },
    overline: {
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 2.5,
      textTransform: 'uppercase'
    },
    h1: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: fontWeightMedium,
      fontSize: fontSizeScaleUp04,
      lineHeight: fontLineHeightLow,
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp06,
        fontWeight: fontWeightLight,
      },
    },
    h2: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: fontWeightSemiBold,
      fontSize: fontSizeScaleUp03,
      lineHeight: fontLineHeightLow,
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp05,
        fontWeight: fontWeightRegular,
      },
    },
    h3: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: fontWeightBold,
      fontSize: fontSizeScaleUp03,
      lineHeight: fontLineHeightLow,
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp04,
        fontWeight: fontWeightMedium,
      },
    },
    h4: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: fontWeightBold,
      fontSize: fontSizeScaleUp01,
      lineHeight: fontLineHeightLow,
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp03,
        fontWeight: fontWeightSemiBold,
      },
    },
    h5: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: fontWeightExtraBold,
      fontSize: fontSizeBasePx,
      lineHeight: fontLineHeightLow,
      textTransform: 'uppercase',
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp02,
        fontWeight: fontWeightBold,
      },
    },
    h6: {
      fontFamily: 'Rawline, "Raleway",  sans-serif',
      fontWeight: fontWeightExtraBold,
      fontSize: fontSizeScaleDown01,
      lineHeight: fontLineHeightLow,
      textTransform: 'uppercase',
      [theme.breakpoints.up('sm')]: {
        fontSize: fontSizeScaleUp01,
        fontWeight: fontWeightExtraBold,
      },
    }
  };
};

function multiplyFontSize(font, unit, multiplyBy) {
  const fontSize = Number(font.replace(unit, ''));
  return `${fontSize * multiplyBy}${unit}`;
}
