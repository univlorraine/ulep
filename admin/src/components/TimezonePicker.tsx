import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';

interface TimezonePickerProps {
    onChange: (value: string) => void;
    value?: string;
}

const TimezonePicker: React.FC<TimezonePickerProps> = ({ onChange, value }) => (
    <FormControl>
        <Select
            id="countries-picker"
            onChange={(timezone) => onChange(timezone.target.value)}
            sx={{ my: 2, width: '100%' }}
            value={value ?? ''}
            variant="standard"
        >
            {Intl.supportedValuesOf('timeZone').map((timzeone: string) => (
                <MenuItem key={timzeone} value={timzeone}>
                    {timzeone}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

export default TimezonePicker;
