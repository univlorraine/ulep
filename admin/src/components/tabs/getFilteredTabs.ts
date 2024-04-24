import { usePermissions } from 'react-admin';
import { subMenus } from '../menu/CustomMenu';

const getFilteredTabs = (subMenuName: string) => {
    const { permissions } = usePermissions();

    return subMenus[subMenuName].filter((link) => !link.role || permissions.checkRole(link.role));
};

export default getFilteredTabs;
