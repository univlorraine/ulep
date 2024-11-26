import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import University from '../entities/University';

interface UniversityPickerProps {
    universities: University[];
    onChange: (universityId: string) => void;
    value?: string;
}

const UniversityPicker: React.FC<UniversityPickerProps> = ({ universities, onChange, value }) => (
    <FormControl>
        <Select
            id="university-picker"
            onChange={(event) => onChange(event.target.value)}
            sx={{ mb: 2, width: '100%' }}
            value={value}
            disableUnderline
        >
            {universities.map((university: University) => (
                <MenuItem key={university.id} value={university.id}>
                    {university.name}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

export default UniversityPicker;
