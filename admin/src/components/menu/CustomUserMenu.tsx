import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Divider, ListItem, ListSubheader } from '@mui/material';
import * as React from 'react';
import {
    UserMenu,
    MenuItemLink,
    useTranslate,
    useLogout,
    useGetIdentity,
    useUserMenu,
    UserIdentity,
} from 'react-admin';
import CustomAvatar from '../CustomAvatar';

type UsernameProps = {
    user: UserIdentity;
};

type AdminMenuProps = {
    user: UserIdentity | undefined;
};

const Username = ({ user }: UsernameProps) => (
    <>
        <ListItem>{`${user.firstName} ${user.lastName}`}</ListItem>
        <ListSubheader sx={{ lineHeight: 'inherit', marginBottom: '12px' }}>{user.email}</ListSubheader>
    </>
);

const AdminMenu = ({ user }: AdminMenuProps) => {
    const translate = useTranslate();
    const logout = useLogout();
    const { onClose } = useUserMenu();

    return (
        <div>
            {user && <Username user={user} />}
            {user && <Divider />}
            {user && (
                <MenuItemLink
                    leftIcon={<PersonIcon />}
                    onClick={onClose}
                    primaryText={translate('global.profile')}
                    to={`/admin-profile/${user.id}`}
                />
            )}
            {user && <Divider />}
            <MenuItemLink
                leftIcon={<ExitToAppIcon />}
                onClick={logout}
                primaryText={translate('global.disconnect')}
                to="/"
            />
        </div>
    );
};

const CustomUserMenu = (props: any) => {
    const { data: user } = useGetIdentity();
    const avatar = user ? (
        <CustomAvatar avatarId={user.id} firstName={user.firstName} lastName={user.lastName} />
    ) : (
        <Avatar />
    );

    return (
        <UserMenu {...props} icon={avatar}>
            <AdminMenu user={user} />
        </UserMenu>
    );
};

export default CustomUserMenu;
