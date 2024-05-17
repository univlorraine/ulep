import { FormControl, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDataProvider, useNotify, usePermissions, useTranslate } from 'react-admin';
import { AdminGroup, KeycloakGroup, Role } from '../entities/Administrator';

interface GroupPickerProps {
    onChange: (value: KeycloakGroup) => void;
    value?: KeycloakGroup;
}

const AdminGroupPicker: React.FC<GroupPickerProps> = ({ onChange, value }) => {
    const { permissions } = usePermissions();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const translate = useTranslate();
    const [keycloakGroups, setKeycloackGroups] = useState<KeycloakGroup[]>([]);

    const fetchKeycloakGroups = async () => {
        try {
            const fetchedKeycloakGroups: KeycloakGroup[] = await dataProvider.getKeycloackAdminGroups();

            return setKeycloackGroups(
                fetchedKeycloakGroups.filter(
                    (group) => permissions.checkRole(Role.SUPER_ADMIN) || group.name !== AdminGroup.SUPER_ADMIN
                )
            );
        } catch (err) {
            console.error(err);

            return notify('admin_groups_picker.error');
        }
    };

    useEffect(() => {
        fetchKeycloakGroups();
    }, []);

    const defaultValue = value || keycloakGroups[0];

    return (
        <FormControl>
            <Select
                id="group-picker"
                onChange={(group) => onChange(keycloakGroups.find((g) => group.target.value === g.id) as KeycloakGroup)}
                sx={{ mb: 2, width: '100%' }}
                value={defaultValue && defaultValue.id}
                variant="standard"
                disableUnderline
            >
                {keycloakGroups.map((group: KeycloakGroup) => (
                    <MenuItem key={group.id} value={group.id}>
                        {translate(`admin_groups_picker.${group.name.toLowerCase()}`)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default AdminGroupPicker;
