import simpleRestProvider from 'ra-data-simple-rest';
import React from 'react';
import { Admin, Resource, AppBar, Toolbar, TitlePortal, LocalesMenuButton } from 'react-admin';
import LoginPage from './auth/LoginPage';
import authProvider, { httpClient } from './providers/authProvider';
import i18nProvider from './providers/i18nProvider';
import UserList from './user/UserList';

export const ULAppBar = () => (
    <AppBar>
        <Toolbar>
            <TitlePortal />
            <LocalesMenuButton />
        </Toolbar>
    </AppBar>
);

const App = () => (
    <Admin
        authProvider={authProvider()}
        dataProvider={simpleRestProvider(`${process.env.REACT_APP_API_URL}`, httpClient)}
        i18nProvider={i18nProvider}
        layout={ULAppBar}
        loginPage={LoginPage}
    >
        <Resource list={UserList} name="users" />
    </Admin>
);

export default App;
