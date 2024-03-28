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
    GetOneResult,
} from 'react-admin';
import Administrator from '../../entities/Administrator';
import customDataProvider from '../../providers/customDataProvider';

const CustomAvatar = ({ userData }: { userData: Administrator }) => {
    const { firstname, lastname } = userData;

    return (
        <Avatar>
            {firstname.charAt(0)}
            {lastname.charAt(0)}
        </Avatar>
    );
};

const Username = ({ userData }: { userData: Administrator }) => {
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
    const { data: userIdentity, isLoading } = useGetIdentity();
    const [userData, setUserData] = React.useState<Administrator | null>(null);

    const getUserData = async () => {
        if (!userIdentity) {
            return;
        }
        const userDataResult: GetOneResult<Administrator> = await customDataProvider.getOne('users/administrators', {
            id: userIdentity.id as string,
        });
        if (userDataResult) {
            setUserData(userDataResult.data);
        }
    };

    React.useEffect(() => {
        if (isLoading) {
            return;
        }
        getUserData().catch((error) => {
            throw Error(error);
        });
    }, [isLoading]);

    return (
        <UserMenu {...props} icon={userData ? <CustomAvatar userData={userData} /> : <Avatar />}>
            {userData && (
                <div>
                    <Username userData={userData} />
                    <Divider />
                    <MenuItemLink
                        leftIcon={<PersonIcon />}
                        primaryText={translate('global.profile')}
                        to={`/users/administrators/${userData.id}`}
                    />
                </div>
            )}
            <Divider />
            <MenuItemLink
                leftIcon={<ExitToAppIcon />}
                onClick={logout}
                primaryText={translate('global.disconnect')}
                to="/"
            />
        </UserMenu>
    );
};

const CustomAppBar = (props: any) => {
    const translate = useTranslate();

    return (
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
                <Typography variant="h1">{translate('header.title')}</Typography>
                <Box flexGrow={1} />
            </Box>
        </AppBar>
    );
};

export default CustomAppBar;
