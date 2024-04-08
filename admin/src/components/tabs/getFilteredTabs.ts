import { usePermissions } from 'react-admin';
import { subMenus } from '../menu/CustomMenu';

export const getFilteredTabs = (subMenuName: string) => {
    const { permissions } = usePermissions();

    return subMenus[subMenuName].filter((link) => !link.permission || link.permission === permissions);
};
