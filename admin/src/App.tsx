import React from 'react';
import { Admin, Resource, useTranslate } from 'react-admin';
import LoginPage from './auth/LoginPage';
import ProfileList from './components/ProfilesList';
import authProvider from './providers/authProvider';
import customDataProvider from './providers/customDataProvider';
import i18nProvider from './providers/i18nProvider';
import UserList from './user/UserList';

const App = () => {
    const translate = useTranslate();

    return (
        <Admin
            authProvider={authProvider()}
            dataProvider={customDataProvider}
            i18nProvider={i18nProvider}
            loginPage={LoginPage}
        >
            <Resource list={UserList} name="users" options={{ label: translate('users.userListTitle') }} />
            <Resource list={ProfileList} name="profiles" options={{ label: translate('profiles.label') }} />
        </Admin>
    );
};

export default App;
