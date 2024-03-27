import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Typography, Box, Divider } from '@mui/material';
import * as React from 'react';
import {
    LocalesMenuButton,
    LoadingIndicator,
    AppBar,
    UserMenu,
    MenuItemLink,
    useTranslate,
    useLogout,
} from 'react-admin';

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
