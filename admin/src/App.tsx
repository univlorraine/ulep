import React from 'react';
import { Admin, Resource, useTranslate } from 'react-admin';
import LoginPage from './pages/auth/login';
import countries from './pages/countries';
import languages from './pages/languages';
import profiles from './pages/profiles';
import universities from './pages/universities';
import authProvider from './providers/authProvider';
import customDataProvider from './providers/customDataProvider';
import i18nProvider from './providers/i18nProvider';

const App = () => {
    const translate = useTranslate();

    return (
        <Admin
            authProvider={authProvider()}
            dataProvider={customDataProvider}
            i18nProvider={i18nProvider}
            loginPage={LoginPage}
        >
            <Resource
                name="profiles"
                options={{ label: translate('profiles.label') }}
                {...profiles}
            />
            <Resource
                name="countries"
                options={{ label: 'Countries' }}
                {...countries}
            />
            <Resource
                name="languages"
                options={{ label: 'Languages' }}
                {...languages}
            />
            <Resource
                name="universities"
                options={{ label: 'Universités' }}
                recordRepresentation="name"
                {...universities}
            />
        </Admin>
    );
};

export default App;
