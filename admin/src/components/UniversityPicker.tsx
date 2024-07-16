import { FormControl, MenuItem, Select } from '@mui/material';
import React, { useEffect } from 'react';
import { useGetList } from 'react-admin';
import University, { isCentralUniversity } from '../entities/University';

interface UniversityPickerProps {
    initialValue?: string;
    onChange: (value: University) => void;
    value?: University;
}

const UniversityPicker: React.FC<UniversityPickerProps> = ({ initialValue, onChange, value }) => {
    const { data, isLoading } = useGetList('universities');

    useEffect(() => {
        if (data) {
            const initialUniverisity = data.find(
                (university: University) =>
                    university.id === initialValue || (initialValue === 'central' && isCentralUniversity(university))
            );
            onChange(initialUniverisity || data[0]);
        }
    }, [data]);

    if (isLoading || !data || !value) {
        return <div />;
    }

    return (
        <FormControl>
            <Select
                id="university-picker"
                onChange={(university) => onChange(data.find((u: University) => university.target.value === u.id))}
                sx={{ mb: 2, width: '100%' }}
                value={value.id}
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
