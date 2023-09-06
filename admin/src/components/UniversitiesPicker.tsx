import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import React, { useState } from 'react';
import { useGetList, Loading } from 'react-admin';
import University from '../entities/University';

interface UniversitiesPickerProps {
    onSelected: (universityIds: string[]) => void;
}

const UniversitiesPicker = ({ onSelected }: UniversitiesPickerProps) => {
    const { data, isLoading, error } = useGetList<University>('universities');

    const [universityIds, setUniversityIds] = useState<string[]>([]);

    if (isLoading) {
        return <Loading />;
    }
    if (error || !data) {
        return <div>Error</div>;
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
                    setUniversityIds(event.target.value);
                    onSelected(event.target.value);
                }}
                placeholder="Sélectionner les universités"
                renderValue={(selectedIds) =>
                    selectedIds.map((id) => data.find((item) => item.id === id)?.name).join(', ')
                }
                value={universityIds}
                multiple
            >
                {data.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        <Checkbox checked={universityIds.includes(item.id)} />
                        <ListItemText>{item.name}</ListItemText>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default UniversitiesPicker;
