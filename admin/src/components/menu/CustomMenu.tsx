import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { Menu, usePermissions, useGetIdentity, useTranslate } from 'react-admin';
import { Role } from '../../providers/authProvider';
import useCurrentPathname from './useCurrentPathname';

export type LinkPage = {
    resource: string;
    type: string;
    id?: string;
    label: string;
    role?: string;
};

export type SubMenusType = {
    [key: string]: LinkPage[];
};

export const subMenus: SubMenusType = {
    configuration: [
        {
            resource: 'instance',
            id: 'config',
            type: 'show',
            label: 'instance.tabLabel',
        },
        {
            resource: 'users/administrators',
            type: 'list',
            label: 'administrators.tabLabel',
        },
        {
            resource: 'languages',
            type: 'list',
            label: 'languages.tabLabel',
        },
        {
            resource: 'languages/requests',
            type: 'list',
            label: 'suggested_languages.tabLabel',
        },
        {
            resource: 'languages/requests/count',
            type: 'list',
            label: 'count_suggested_languages.tabLabel',
        },
        {
            resource: 'interests/categories',
            type: 'list',
            label: 'interest_categories.tabLabel',
        },
        {
            resource: 'countries',
            type: 'list',
            label: 'countries.tabLabel',
        },
    ],
    reports: [
        {
            resource: 'reports',
            type: 'list',
            label: 'reports.tabLabel',
        },
        {
            resource: 'reports/categories',
            type: 'list',
            label: 'report_categories.tabLabel',
            role: Role.SUPER_ADMIN,
        },
    ],
    universities: [
        {
            resource: 'universities',
            type: 'list',
            label: 'universities.tabLabel',
        },
        {
            resource: 'campus',
            type: 'list',
            label: 'campus.tabLabel',
        },
    ],
};

const manageActiveClass = (ref: HTMLDivElement, subMenuName: string, currentPathname: string) => {
    const resources = subMenus[subMenuName].map((link) => link.resource);
    const aElement = ref.firstElementChild;
    const currentResource = resources.filter((resource) => currentPathname.startsWith(resource.split('/')[0])); // The resource is split because of "interest" subpages
    if (aElement && currentResource.length !== 0) {
        aElement.classList.add('RaMenuItemLink-active');
    } else if (aElement) {
        aElement.classList.remove('RaMenuItemLink-active');
    }
};

const CustomMenu = () => {
    const { data } = useGetIdentity();
    const { permissions } = usePermissions();
    const translate = useTranslate();
    const currentPathname = useCurrentPathname();
    const [universitiesRef, setUniversitiesRef] = useState<HTMLDivElement>();
    const [configurationRef, setConfigurationRef] = useState<HTMLDivElement>();

    if (universitiesRef) {
        manageActiveClass(universitiesRef, 'universities', currentPathname);
    }
    if (configurationRef) {
        manageActiveClass(configurationRef, 'configuration', currentPathname);
    }

    return (
        <Menu sx={{ display: 'flex' }}>
            <Menu.ResourceItem name="profiles" />
            <Menu.ResourceItem name="learning-languages" />
            {permissions.checkRole(Role.MANAGER) && data && data.universityId && (
                <Menu.Item
                    leftIcon={<SchoolIcon />}
                    primaryText={translate('universities.label')}
                    to={`/universities/${data.universityId}/show`}
                />
            )}
            {permissions.checkRole(Role.SUPER_ADMIN) && (
                // Note: div is mandatory to group these Menu.Item as Fragment throw an error from MUI component
                <div>
                    <Box ref={(newRef: HTMLDivElement) => setUniversitiesRef(newRef)}>
                        <Menu.ResourceItem name="universities" />
                    </Box>
                    <Menu.ResourceItem name="objectives" />
                    <Menu.ResourceItem name="proficiency/questions" />
                </div>
            )}
            <Menu.ResourceItem name="reports" />
            {permissions.checkRole(Role.SUPER_ADMIN) && (
                // Note: div is mandatory to group these Menu.Item as Fragment throw an error from MUI component
                <div>
                    <Divider sx={{ margin: '0 !important' }} />
                    <Box ref={(newRef: HTMLDivElement) => setConfigurationRef(newRef)}>
                        <Menu.Item
                            leftIcon={<SettingsIcon />}
                            primaryText={translate('instance.label')}
                            to="/instance/config/show"
                        />
                    </Box>
                </div>
            )}
        </Menu>
    );
};

export default CustomMenu;
