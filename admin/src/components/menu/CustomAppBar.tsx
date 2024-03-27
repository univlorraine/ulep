import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Avatar, Typography, Box, Divider, ListItem, ListSubheader } from '@mui/material';
import * as React from 'react';
import {
    LocalesMenuButton,
    LoadingIndicator,
    AppBar,
    UserMenu,
    MenuItemLink,
    useTranslate,
    useLogout,
    useGetIdentity,
    useGetOne,
    UserIdentity,
} from 'react-admin';

const CustomAvatar = ({ userIdentity }: { userIdentity: UserIdentity }) => {
    const { data: userData } = useGetOne('users/administrators', { id: userIdentity?.id });

    if (userData) {
        const { firstname, lastname } = userData;

        return (
            <Avatar>
                {firstname.charAt(0)}
                {lastname.charAt(0)}
            </Avatar>
        );
    }

    return <Avatar />;
};

const Username = ({ userIdentity }: { userIdentity: UserIdentity }) => {
    const { data: userData } = useGetOne('users/administrators', { id: userIdentity?.id });
    const { firstname, lastname, email } = userData;

    return (
        <>
            <ListItem>{`${firstname} ${lastname}`}</ListItem>
            <ListSubheader sx={{ lineHeight: 'inherit', marginBottom: '12px' }}>{email}</ListSubheader>
        </>
    );
};

const CustomUserMenu = (props: any) => {
    const translate = useTranslate();
    const logout = useLogout();
    const { data: userIdentity } = useGetIdentity();

    return (
        <UserMenu {...props} icon={userIdentity ? <CustomAvatar userIdentity={userIdentity} /> : <Avatar />}>
            {userIdentity && <Username userIdentity={userIdentity} />}
            <Divider />
            <MenuItemLink
                leftIcon={<ExitToAppIcon />}
                onClick={logout}
                primaryText={translate('global.disconnect')}
                to=""
            />
        </UserMenu>
    );
};

const CustomAppBar = (props: any) => {
    const translate = useTranslate();

    return (
        <>
            <AppBar
                {...props}
                toolbar={
                    <>
                        <LoadingIndicator />
                        <LocalesMenuButton />
                    </>
                }
                userMenu={<CustomUserMenu />}
            >
                <Box alignItems="center" display="flex" gap="16px" width="100%">
                    <img alt="" src="/ulep_logo.png" />
                    <Typography variant="h6">{translate('header.title')}</Typography>
                    <Box flexGrow={1} />
                </Box>
            </AppBar>
            <Divider />
        </>
    );
};

export default CustomAppBar;
