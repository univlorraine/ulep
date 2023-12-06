import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Typography, Box } from '@mui/material';
import * as React from 'react';
import { AppBar, UserMenu, MenuItemLink, useTranslate, useLogout } from 'react-admin';

const CustomUserMenu = (props: any) => {
    const translate = useTranslate();
    const logout = useLogout();

    return (
        <UserMenu {...props}>
            <MenuItemLink
                leftIcon={<ExitToAppIcon />}
                onClick={logout}
                primaryText={translate('global.disconnect')}
                to=""
            />
        </UserMenu>
    );
};

const CustomAppBar = (props: any) => (
    <AppBar {...props} userMenu={<CustomUserMenu />}>
        <Box alignItems="center" display="flex" width="100%">
            <Typography color="inherit" id="react-admin-title" variant="h6" />
            <Box flexGrow={1} />
        </Box>
    </AppBar>
);

export default CustomAppBar;
