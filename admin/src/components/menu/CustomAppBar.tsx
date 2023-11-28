import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Typography, Switch, SwitchProps, Box } from '@mui/material';
import * as React from 'react';
import {
    AppBar,
    UserMenu,
    MenuItemLink,
    useNotify,
    useUpdate,
    useGetOne,
    useTranslate,
    useLogout,
    usePermissions,
    useRefresh,
} from 'react-admin';
import { ADMIN_PERMISSION } from '../../providers/authProvider';
import usePurge from './usePurge';

const CustomUserMenu = (props: any) => {
    const translate = useTranslate();
    const logout = useLogout();
    const { permissions } = usePermissions();
    const refresh = useRefresh();

    const { mutate: purge } = usePurge();

    const handlePurge = async () => {
        await purge();
        refresh();
    };

    return (
        <UserMenu {...props}>
            <MenuItemLink
                leftIcon={<ExitToAppIcon />}
                onClick={logout}
                primaryText={translate('global.disconnect')}
                to=""
            />
            {permissions === ADMIN_PERMISSION && (
                <MenuItemLink
                    leftIcon={<DeleteIcon />}
                    onClick={handlePurge}
                    primaryText={translate('purge.title')}
                    to=""
                />
            )}
        </UserMenu>
    );
};

const CustomAppBar = (props: any) => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();
    const { isLoading, data } = useGetOne('instance', { id: 'config' });

    const handleToggle: SwitchProps['onChange'] = async (event) => {
        try {
            const isOn = event.target.checked;
            await update('instance', { data: { isInMaintenance: isOn } });
        } catch (error) {
            notify('Error: configuration not updated');
        }
    };

    return (
        <AppBar {...props} userMenu={<CustomUserMenu />}>
            <Box alignItems="center" display="flex" width="100%">
                <Typography color="inherit" id="react-admin-title" variant="h6" />
                <Box flexGrow={1} />
                {!isLoading && data && (
                    <Typography color="inherit" variant="subtitle1">
                        {translate('instance.maintenance')}
                    </Typography>
                )}
                {!isLoading && data && (
                    <Switch
                        defaultChecked={data.isInMaintenance}
                        onChange={handleToggle}
                        value={data.isInMaintenance}
                    />
                )}
            </Box>
        </AppBar>
    );
};

export default CustomAppBar;
