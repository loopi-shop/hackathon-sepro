import { TextField, MenuItem, OutlinedInput, InputLabel, Select, FormControl } from '@mui/material';
import COUNTRY_LIST from './country-list.json';

/**
 * @param {import('@mui/material/TextField').TextFieldProps & { multiple: boolean }} props 
 */
export const CountryISOSelect = (props) => {
  return (
    props.multiple ?
      <FormControl fullWidth={props.fullWidth}>
        <InputLabel id={props.id}>{props.label}</InputLabel>
        <Select
          {...props}
          multiple
          renderValue={(value) => {
            let parsedValue = []
            if (typeof value === 'string') {
              parsedValue = value.split(',');
            } else parsedValue = value;
            const filtredCountries = COUNTRY_LIST.filter((country) => parsedValue.includes(country.code));
            return filtredCountries.map((country) => country.name).join(', ');
          }}
          input={<OutlinedInput label={props.label} />}
        >
          {COUNTRY_LIST.map((option) => (
            <MenuItem
              key={option.code}
              value={option.code}
            >
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      :
      <TextField
        {...props}
        select
        id={props.id}
        name={props.name}
      >
        {COUNTRY_LIST.map((option) => (
          <MenuItem
            key={option.code}
            value={option.code}
          >
            {option.name}
          </MenuItem>
        ))}
      </TextField>
  )
};


