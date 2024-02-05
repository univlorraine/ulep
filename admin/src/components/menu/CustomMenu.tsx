import SchoolIcon from '@mui/icons-material/School';
import React from 'react';
import { Menu, usePermissions, useGetIdentity } from 'react-admin';
import { ADMIN_PERMISSION, SUPER_ADMIN_PERMISSION } from '../../providers/authProvider';

const CustomMenu = () => {
    const { data } = useGetIdentity();
    const { permissions } = usePermissions();

    return (
        <Menu sx={{ display: 'flex' }}>
            <Menu.ResourceItem name="profiles" />
            <Menu.ResourceItem name="learning-languages" />
            <Menu.ResourceItem name="users/administrators" />
            {permissions === ADMIN_PERMISSION && data && data.universityId && (
                <Menu.Item leftIcon={<SchoolIcon />} to={`/universities/${data.universityId}/show`} />
            )}
            {permissions === SUPER_ADMIN_PERMISSION && (
                // Note: div is mandatory to group these Menu.Item as Fragment throw an error from MUI component
                <div>
                    <Menu.ResourceItem name="instance/config/show" />
                    <Menu.ResourceItem name="universities" />
                    <Menu.ResourceItem name="campus" />
                    <Menu.ResourceItem name="countries" />
                    <Menu.ResourceItem name="languages" />
                    <Menu.ResourceItem name="languages/requests" />
                    <Menu.ResourceItem name="languages/requests/count" />
                    <Menu.ResourceItem name="interests/categories" />
                    <Menu.ResourceItem name="proficiency/questions" />
                    <Menu.ResourceItem name="objectives" />
                </div>
            )}
            <Menu.ResourceItem name="reports" />
            {permissions === SUPER_ADMIN_PERMISSION && (
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Menu.ResourceItem name="reports/categories" />
                </div>
            )}
        </Menu>
    );
};

export default CustomMenu;
