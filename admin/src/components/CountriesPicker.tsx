import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useGetList } from 'react-admin';
import Country from '../entities/Country';

interface CountriesPickerProps {
    onChange: (value: Country) => void;
    value?: Country;
}

const CountriesPicker: React.FC<CountriesPickerProps> = ({ onChange, value }) => {
    const { data, isLoading } = useGetList('countries');

    if (isLoading || !data) {
        return <div />;
    }

    return (
        <FormControl>
            <Select
                id="countries-picker"
                onChange={(country) => onChange(data.find((c: Country) => country.target.value === c.id))}
                sx={{ my: 2, width: 300 }}
                value={value ? value.id : ''}
                variant="standard"
            >
                {data.map((country: Country) => (
                    <MenuItem key={country.id} value={country.id}>
                        {country.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CountriesPicker;
