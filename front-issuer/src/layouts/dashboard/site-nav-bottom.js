import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';

import { Box, ButtonBase, Divider, Link, Stack, Typography } from '@mui/material';

import { social } from './config';

export const SideNavBottom = () => {
  return (
    <>
      <Stack sx={{ listStyle: 'none' }}>
        <Divider sx={{ borderColor: '#ccc' }} />
        <Box sx={{ display: 'flex' }}>
          <ButtonBase
            component="a"
            href="https://loopipay.com/sobre-nos"
            target="_blank"
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'flex-start',
              px: '40px',
              py: '16px',
              textAlign: 'left',
              width: '100%',
              fontFamily: (theme) => theme.typography.fontFamily,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)'
              }
            }}
          >
            Sobre LoopiPay
            <Box sx={{ color: '#1351B4' }}>
              <FontAwesomeIcon icon={faExternalLinkSquareAlt} />
            </Box>
          </ButtonBase>
        </Box>
        <Divider sx={{ borderColor: '#ccc' }} />
        <Box sx={{ py: 2, pl: '40px', pr: '32px' }}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: 14,
              lineHeight: '19px'
            }}
          >
            Redes Sociais
          </Typography>
          <Box
            sx={{
              display: 'flex',
              mt: '4px',
              mb: 3,
              color: '#0E0D14E0',
              justifyContent: 'space-between'
            }}
          >
            {social.map((item) => (
              <Link key={item.href} component="a" href={item.href} target="_blank">
                {item.icon}
              </Link>
            ))}
          </Box>
        </Box>
      </Stack>
    </>
  );
};
