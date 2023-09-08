import { Checkbox, CircularProgress, FormControl, InputLabel, ListItemText, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import React from 'react';
import { useGetList } from 'react-admin';
import University from '../entities/University';

interface UniversitiesPickerProps {
    value: string[];
    onSelected: (universityIds: string[]) => void;
}

const UniversitiesPicker = ({ value, onSelected }: UniversitiesPickerProps) => {
    const { data, isLoading, error } = useGetList<University>('universities');

    if (isLoading) {
        return <CircularProgress />;
    }
    if (error || !data) {
        console.error(error);

        return (
            <div>
                <p>Une erreur est survenue lors de la récupération des universités</p>
            </div>
        );
    }

    return (
        <FormControl sx={{ width: '100%' }}>
            <InputLabel id="universities-select-label">Universités</InputLabel>
            <Select<string[]>
                labelId="universities-select-label"
                onChange={(event) => {
                    if (typeof event.target.value === 'string') {
                        throw new Error('Multiple select should emit event with array of IDs');
                    }
                    onSelected(event.target.value);
                }}
                placeholder="Sélectionner les universités"
                renderValue={(selectedIds) =>
                    selectedIds.map((id) => data.find((item) => item.id === id)?.name).join(', ')
                }
                value={value}
                multiple
            >
                {data.map((item) => (
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
