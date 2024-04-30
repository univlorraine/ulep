import { FormControl, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDataProvider, useNotify, usePermissions, useTranslate } from 'react-admin';
import { AdminGroup, KeycloakGroup, Role } from '../entities/Administrator';

interface GroupsPickerProps {
    onChange: (value: KeycloakGroup) => void;
    value?: KeycloakGroup[];
}

const AdminGroupsPicker: React.FC<GroupsPickerProps> = ({ onChange, value }) => {
    const { permissions } = usePermissions();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const translate = useTranslate();

    const [keycloakGroups, setKeycloackGroups] = useState<KeycloakGroup[]>([]);

    // eslint-disable-next-line consistent-return
    const fetchKeycloakGroups = async () => {
        try {
            const fetchedKeycloakGroups = await dataProvider.getKeycloackGroups();
            setKeycloackGroups(fetchedKeycloakGroups);
        } catch (err) {
            console.error(err);

            return notify('admin_groups_picker.error');
        }
    };

    useEffect(() => {
        fetchKeycloakGroups();
    }, []);

    // Filter keycloakGroups to keep only admin ones
    const adminGroupNames = Object.values(AdminGroup) as string[];
    const adminGroups = keycloakGroups.filter((keycloakGroup) => adminGroupNames.includes(keycloakGroup.name));

    // Filter adminGroups to remove it from the picker if it's already selected
    let filteredGroups = adminGroups.filter(
        (keycloakGroup) => !value?.find((group) => group.name === keycloakGroup.name)
    );

    // Filter 'SuperAdministrators' group if the user does not have the 'super-admin' role himself
    if (!permissions.checkRole(Role.SUPER_ADMIN)) {
        filteredGroups = filteredGroups.filter((group) => group.name !== AdminGroup.SUPER_ADMIN);
    }

    return (
        <FormControl>
            <Select
                defaultValue=""
                id="role-picker"
                onChange={(event) => {
                    const newGroup = adminGroups.find((group) => group.id === event.target.value);
                    if (newGroup) {
                        onChange(newGroup);
                    }
                }}
                renderValue={() => translate('admin_groups_picker.placeholder')}
                sx={{ mb: 2, width: '100%' }}
                variant="standard"
                disableUnderline
                displayEmpty
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

export default AdminGroupsPicker;
