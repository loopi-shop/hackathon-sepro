import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, ButtonBase, Divider } from '@mui/material';

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title } = props;

  const linkProps = path
    ? external
      ? {
          component: 'a',
          href: path,
          target: '_blank'
        }
      : {
          component: NextLink,
          href: path
        }
    : {};

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          px: '24px',
          py: '16px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: '#333',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: '#1351B4'
              })
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: '#333',
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            ...(active && {
              fontWeight: 'bold',
              color: '#1351B4'
            }),
            ...(disabled && {
              color: 'neutral.500'
            })
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            color: '#333',
            ...(active && {
              fontWeight: 'bold',
              color: '#1351B4'
            })
          }}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </Box>
      </ButtonBase>
      <Divider sx={{ borderColor: '#ccc' }} />
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired
};
