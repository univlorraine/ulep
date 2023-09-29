import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useGetList } from 'react-admin';
import University from '../entities/University';

interface UniversityPickerProps {
    onChange: (value: University) => void;
    value?: University;
}

const UniversityPicker: React.FC<UniversityPickerProps> = ({ onChange, value }) => {
    const { data, isLoading } = useGetList('universities');

    if (isLoading || !data) {
        return <div />;
    }

    return (
        <FormControl>
            <Select
                id="university-picker"
                onChange={(university) => onChange(data.find((u: University) => university.target.value === u.id))}
                sx={{ mb: 2, width: '100%' }}
                value={value ? value.id : ''}
                variant="standard"
                disableUnderline
            >
                {data.map((university: University) => (
                    <MenuItem key={university.id} value={university.id}>
                        {university.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default UniversityPicker;
