import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useTranslate } from 'react-admin';
import { AdminGroup, KeycloakGroup } from '../../entities/Administrator';
import useGetAdminGroup from './useGetAdminGroups';

interface GroupPickerProps {
    onChange: (value: KeycloakGroup) => void;
    value?: KeycloakGroup;
    isCentralUniversity: boolean;
}

const AdminGroupPicker: React.FC<GroupPickerProps> = ({ onChange, value, isCentralUniversity }) => {
    const translate = useTranslate();
    const keycloakGroups = useGetAdminGroup();

    if (keycloakGroups.length === 0) return <>Loading..</>;

    const filteredGroups = keycloakGroups.filter(
        (group) => isCentralUniversity || group.name !== AdminGroup.SUPER_ADMIN
    );

    return (
        <FormControl>
            <Select
                id="group-picker"
                onChange={(group) => onChange(keycloakGroups.find((g) => group.target.value === g.id) as KeycloakGroup)}
                sx={{ mb: 2, width: '100%' }}
                value={value && value.id}
                disableUnderline
            >
                {filteredGroups.map((group: KeycloakGroup) => (
                    <MenuItem key={group.id} value={group.id}>
                        {translate(`admin_groups_picker.${group.name.toLowerCase()}`)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default AdminGroupPicker;
