import { useEffect, useState } from 'react';
import { useDataProvider, useNotify, usePermissions } from 'react-admin';
import { AdminGroup, KeycloakGroup, Role } from '../../entities/Administrator';

const useGetAdminGroup = () => {
    const { permissions } = usePermissions();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [keycloakGroups, setKeycloackGroups] = useState<KeycloakGroup[]>([]);

    const fetchKeycloakGroups = async () => {
        try {
            const fetchedKeycloakGroups: KeycloakGroup[] = await dataProvider.getKeycloackAdminGroups();

            const filteredGroups = fetchedKeycloakGroups.filter(
                (group) => permissions.checkRole(Role.SUPER_ADMIN) || group.name !== AdminGroup.SUPER_ADMIN
            );

            setKeycloackGroups(filteredGroups);
        } catch (err) {
            console.error(err);

            notify('admin_groups_picker.error');
        }
    };

    useEffect(() => {
        fetchKeycloakGroups();
    }, []);

    return keycloakGroups;
};

export default useGetAdminGroup;
