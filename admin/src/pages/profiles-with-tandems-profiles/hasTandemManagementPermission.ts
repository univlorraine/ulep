import { usePermissions } from 'react-admin';
import { Role } from '../../entities/Administrator';

const hasTandemManagementPermission = () => {
    const { permissions } = usePermissions();

    return permissions.checkRoles([Role.SUPER_ADMIN, Role.MANAGER]);
};

export default hasTandemManagementPermission;
