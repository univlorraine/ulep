import simpleRestProvider from 'ra-data-simple-rest';
import React from 'react';
import { Admin, Resource } from 'react-admin';
import LoginPage from './auth/LoginPage';
import authProvider from './providers/authProvider';
import i18nProvider from './providers/i18nProvider';
import UserList from './user/UserList';

const App = () => (
    <Admin
        authProvider={authProvider()}
        dataProvider={simpleRestProvider('/')}
        i18nProvider={i18nProvider}
        loginPage={LoginPage}
    >
        <Resource list={UserList} name="users" />
    </Admin>
);

export default App;
