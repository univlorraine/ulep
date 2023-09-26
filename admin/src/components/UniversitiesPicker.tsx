import { Checkbox, CircularProgress, FormControl, InputLabel, ListItemText, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import React from 'react';
import { useGetList, useTranslate } from 'react-admin';
import University from '../entities/University';

interface UniversitiesPickerProps {
    value: string[];
    label: string;
    placeholder: string;
    onSelected: (universityIds: string[]) => void;
    filterUniversities?: (university: University) => boolean;
}

const UniversitiesPicker = ({ value, onSelected, label, placeholder, filterUniversities }: UniversitiesPickerProps) => {
    const translate = useTranslate();

    const { data, isLoading, error } = useGetList<University>('universities');

    if (isLoading) {
        return <CircularProgress />;
    }
    if (error || !data) {
        console.error(error);

        return <p>{translate('universitiesPicker.error')}</p>;
    }

    const choices = filterUniversities ? data.filter(filterUniversities) : data;

    return (
        <FormControl sx={{ width: '100%' }}>
            <InputLabel id="universities-select-label">{label}</InputLabel>
            <Select<string[]>
                labelId="universities-select-label"
                onChange={(event) => {
                    if (typeof event.target.value === 'string') {
                        throw new Error('Multiple select should emit event with array of IDs');
                    }
                    onSelected(event.target.value);
                }}
                placeholder={placeholder}
                renderValue={(selectedIds) =>
                    selectedIds.map((id) => data.find((item) => item.id === id)?.name).join(', ')
                }
                value={value}
                multiple
            >
                {choices.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        <Checkbox checked={value.includes(item.id)} />
                        <ListItemText>{item.name}</ListItemText>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default UniversitiesPicker;
