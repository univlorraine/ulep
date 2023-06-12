import simpleRestProvider from 'ra-data-simple-rest';
import React from 'react';
import { Admin, Resource } from 'react-admin';
import { UserList } from './admin/user';
import LoginPage from './auth/LoginPage';
import authProvider from './authProvider';

const App = () => (
    <Admin authProvider={authProvider()} dataProvider={simpleRestProvider('/')} loginPage={LoginPage}>
        <Resource list={UserList} name="users" />
    </Admin>
);

export default App;
