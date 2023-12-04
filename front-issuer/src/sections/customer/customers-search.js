import { faEllipsisVertical, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, SvgIcon, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { Input } from 'src/components/input';

export const CustomersSearch = ({ search, setSearch }) => {
  const [searchOpen, setSearchOpen] = useState();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 5
      }}
    >
      <Typography variant="h6" sx={{ textTransform: 'none', pl: '16px' }}>
        Clientes Ativos {search ? `(${search})` : ''}
      </Typography>
      <Box>
        {searchOpen ? (
          <Input
            autoFocus
            style={{ display: 'inline-block' }}
            iconClass="fas fa-search"
            value={search}
            onChange={(ev) => setSearch(ev.currentTarget.value)}
            onBlur={() => setSearchOpen(false)}
          ></Input>
        ) : (
          <IconButton onClick={() => setSearchOpen(true)}>
            <SvgIcon fontSize="small" color="primary">
              <FontAwesomeIcon icon={faSearch} />
            </SvgIcon>
          </IconButton>
        )}
        <IconButton>
          <SvgIcon fontSize="small" color="primary">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </SvgIcon>
        </IconButton>
      </Box>
    </Box>
  );
};
