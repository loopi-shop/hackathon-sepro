import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Button, IconButton, SvgIcon } from '@mui/material';
import { Container } from '@mui/system';

import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import ChevronLeftIcon from '@heroicons/react/24/solid/ChevronLeftIcon';

export const TPFPagination = (props) => {
  const { count = 0, rowsPerPage = 6, page = 0, onPageChange = (event, page) => {} } = props;

  const pages = useMemo(
    () => Array(Math.ceil(count / rowsPerPage)).fill(true),
    [count, rowsPerPage]
  );
  const disableLeft = !pages.length || page === 0;
  const disableRight = !pages.length || page === pages.length - 1;

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <IconButton
        disabled={disableLeft}
        color={disableLeft ? 'secondary' : 'primary'}
        onClick={() => onPageChange(null, page - 1)}
        sx={{ mr: 2 }}
      >
        <SvgIcon fontSize="small">
          <ChevronLeftIcon />
        </SvgIcon>
      </IconButton>

      {pages.map((_, index) => (
        <Button
          onClick={() => onPageChange(null, index)}
          variant="text"
          key={index}
          sx={{
            display: 'inline-block',
            borderRadius: '100%',
            aspectRatio: 'square',
            p: 0,
            m: 0,
            backgroundColor: page === index && '#0C326F',
            width: 30,
            minWidth: 30,
            color: page === index ? 'white' : '#1351B4',
            ':hover': {
              color: '#0C326F'
            }
          }}
        >
          {index + 1}
        </Button>
      ))}
      <IconButton
        disabled={disableRight}
        color={disableRight ? 'secondary' : 'primary'}
        onClick={() => onPageChange(null, page + 1)}
        sx={{ ml: 2 }}
      >
        <SvgIcon fontSize="small">
          <ChevronRightIcon />
        </SvgIcon>
      </IconButton>
    </Container>
  );
};

TPFPagination.propTypes = {
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  onPageChange: PropTypes.func
};
