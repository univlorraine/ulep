import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
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
} from 'react-admin';

type CustomAvatarProps = {
    lastName: string;
    firstName: string;
};

type UsernameProps = {
    lastName: string;
    firstName: string;
    email: string;
};

const CustomAvatar = ({ lastName, firstName }: CustomAvatarProps) => (
    <Avatar>
        {firstName.charAt(0)}
        {lastName.charAt(0)}
    </Avatar>
);

const Username = ({ lastName, firstName, email }: UsernameProps) => (
    <>
        <ListItem>{`${firstName} ${lastName}`}</ListItem>
        <ListSubheader sx={{ lineHeight: 'inherit', marginBottom: '12px' }}>{email}</ListSubheader>
    </>
);

const CustomUserMenu = (props: any) => {
    const translate = useTranslate();
    const logout = useLogout();

    const { data: userData } = useGetIdentity();
    let lastName;
    let firstName;
    let email;
    if (userData) {
        const { family_name: familyName, given_name: givenName, email: userEmail } = userData.data;
        lastName = familyName;
        firstName = givenName;
        email = userEmail;
    }

    return (
        <UserMenu {...props} icon={userData ? <CustomAvatar firstName={firstName} lastName={lastName} /> : <Avatar />}>
            {userData && <Username email={email} firstName={firstName} lastName={lastName} />}
            {userData && <Divider />}
            {userData && (
                <MenuItemLink
                    leftIcon={<PersonIcon />}
                    primaryText={translate('global.profile')}
                    to={`/users/administrators/${userData.id}`}
                />
            )}
            {userData && <Divider />}
            <MenuItemLink
                leftIcon={<ExitToAppIcon />}
                onClick={logout}
                primaryText={translate('global.disconnect')}
                to="/"
            />
        </UserMenu>
    );
};

const CustomToolbar = () => (
    <>
        <LoadingIndicator />
        <LocalesMenuButton />
    </>
);

const CustomAppBar = (props: any) => {
    const translate = useTranslate();

    return (
        <AppBar {...props} toolbar={<CustomToolbar />} userMenu={<CustomUserMenu />}>
            <Box alignItems="center" display="flex" gap="16px" width="100%">
                <img alt="" src="/ulep_logo.png" />
                <Typography variant="h1">{translate('header.title')}</Typography>
                <Box flexGrow={1} />
            </Box>
        </AppBar>
    );
};

export default CustomAppBar;
