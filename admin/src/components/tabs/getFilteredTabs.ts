import { usePermissions } from 'react-admin';
import { subMenus } from '../menu/CustomMenu';

const getFilteredTabs = (subMenuName: string) => {
    const { permissions } = usePermissions();

    return subMenus[subMenuName].filter((link) => !link.permission || link.permission === permissions);
};

export default getFilteredTabs;
