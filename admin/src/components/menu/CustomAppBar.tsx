import { Typography, Box } from '@mui/material';
import * as React from 'react';
import { LocalesMenuButton, LoadingIndicator, AppBar, useTranslate } from 'react-admin';
import CustomUserMenu from './CustomUserMenu';

const CustomToolbar = () => {
    const translate = useTranslate();

    return (
        <>
            <LoadingIndicator
                sx={{
                    '& .RaLoadingIndicator-loadedIcon::after': {
                        content: `"${translate('header.update')}"`,
                        marginLeft: '5px',
                    },
                }}
            />
            <LocalesMenuButton />
        </>
    );
};

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
