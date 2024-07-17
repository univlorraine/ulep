import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { Menu, usePermissions, useGetIdentity, useTranslate } from 'react-admin';
import { Role } from '../../entities/Administrator';
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
            resource: 'users/administrators',
            type: 'list',
            label: 'administrators.tabLabel',
        },
        {
            resource: 'instance',
            id: 'config',
            type: 'show',
            label: 'instance.tabLabel',
            role: Role.SUPER_ADMIN,
        },
        {
            resource: 'languages',
            type: 'list',
            label: 'languages.tabLabel',
            role: Role.SUPER_ADMIN,
        },
        {
            resource: 'languages/requests',
            type: 'list',
            label: 'suggested_languages.tabLabel',
            role: Role.SUPER_ADMIN,
        },
        {
            resource: 'languages/requests/count',
            type: 'list',
            label: 'count_suggested_languages.tabLabel',
            role: Role.SUPER_ADMIN,
        },
        {
            resource: 'interests/categories',
            type: 'list',
            label: 'interest_categories.tabLabel',
            role: Role.SUPER_ADMIN,
        },
        {
            resource: 'countries',
            type: 'list',
            label: 'countries.tabLabel',
            role: Role.SUPER_ADMIN,
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

const RA_ACTIVE_CLASS = 'RaMenuItemLink-active';

const manageSubMenusActiveClass = (ref: HTMLDivElement, currentPathname: string, subMenuName: string) => {
    const aElement = ref.firstElementChild;

    const resources = subMenus[subMenuName].map((link) => link.resource);
    const currentResource = resources.filter((resource) => currentPathname.startsWith(resource.split('/')[0])); // The resource is split because of "interest" subpages

    if (aElement && currentResource.length !== 0) {
        aElement.classList.add(RA_ACTIVE_CLASS);
    } else if (aElement) {
        aElement.classList.remove(RA_ACTIVE_CLASS);
    }
};

const manageCurrentPathActiveClass = (ref: HTMLDivElement, currentPathname: string) => {
    const aElement = ref.firstElementChild;

    if (currentPathname.includes('profiles/with-tandem')) {
        aElement?.classList.remove(RA_ACTIVE_CLASS);
    } else if (currentPathname.includes('profiles')) {
        aElement?.classList.add(RA_ACTIVE_CLASS);
    }
};

const CustomMenu = () => {
    const { data } = useGetIdentity();
    const { permissions } = usePermissions();
    const translate = useTranslate();
    const currentPathname = useCurrentPathname();
    const [universitiesRef, setUniversitiesRef] = useState<HTMLDivElement>();
    const [configurationRef, setConfigurationRef] = useState<HTMLDivElement>();
    const [profilesRef, setProfilesRef] = useState<HTMLDivElement>();

    if (universitiesRef) {
        manageSubMenusActiveClass(universitiesRef, currentPathname, 'universities');
    }
    if (configurationRef) {
        manageSubMenusActiveClass(configurationRef, currentPathname, 'configuration');
    }
    if (profilesRef) {
        manageCurrentPathActiveClass(profilesRef, currentPathname);
    }

    return (
        <Menu sx={{ display: 'flex' }}>
            <Box ref={(newRef: HTMLDivElement) => setProfilesRef(newRef)}>
                <Menu.ResourceItem name="profiles" />
            </Box>
            <Menu.ResourceItem name="profiles/with-tandem" />
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
            {!permissions.checkRole(Role.ANIMATOR) && (
                <div>
                    <Divider sx={{ margin: '0 !important' }} />
                    <Box ref={(newRef: HTMLDivElement) => setConfigurationRef(newRef)}>
                        <Menu.Item
                            leftIcon={<SettingsIcon />}
                            primaryText={translate('instance.label')}
                            to="/users/administrators"
                        />
                    </Box>
                </div>
            )}
        </Menu>
    );
};

export default CustomMenu;
