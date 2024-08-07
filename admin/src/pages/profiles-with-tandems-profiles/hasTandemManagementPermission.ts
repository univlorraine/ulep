import { Role } from '../../entities/Administrator';
import { GetPermissionsInterface } from '../../providers/authProvider';

const hasTandemManagementPermission = (permissions: GetPermissionsInterface): boolean =>
    permissions.checkRoles([Role.SUPER_ADMIN, Role.MANAGER]);

export default hasTandemManagementPermission;
