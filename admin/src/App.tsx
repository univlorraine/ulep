import React from 'react';
import { Admin, Resource, useTranslate } from 'react-admin';
import LoginPage from './pages/auth/login';
import countSuggestedLanguages from './pages/count-suggested-languages';
import countries from './pages/countries';
import languages from './pages/languages';
import objectives from './pages/objectives';
import profiles from './pages/profiles';
import questions from './pages/questions';
import reports from './pages/report';
import reportCategories from './pages/report-categories';
import suggestedLanguages from './pages/suggested-languages';
import universities from './pages/universities';
import authProvider from './providers/authProvider';
import customDataProvider from './providers/customDataProvider';
import i18nProvider from './providers/i18nProvider';
import interests from './pages/interests';
import categoryInterest from './pages/category-interest';

const App = () => {
    const translate = useTranslate();

    return (
        <Admin
            authProvider={authProvider()}
            dataProvider={customDataProvider}
            i18nProvider={i18nProvider}
            loginPage={LoginPage}
        >
            <Resource name="profiles" options={{ label: translate('profiles.label') }} {...profiles} />
            <Resource name="countries" options={{ label: translate('countries.label') }} {...countries} />
            <Resource name="languages" options={{ label: translate('languages.label') }} {...languages} />
            <Resource
                name="languages/requests"
                options={{ label: translate('suggested_languages.label') }}
                {...suggestedLanguages}
            />
            <Resource
                name="languages/requests/count"
                options={{ label: translate('count_suggested_languages.label') }}
                {...countSuggestedLanguages}
            />
            <Resource name="interests" options={{ label: translate('objectives.label') }} {...interests} />
            <Resource
                name="interests/categories"
                options={{ label: translate('interest_categories.label') }}
                {...categoryInterest}
            />
            <Resource name="objectives" options={{ label: translate('objectives.label') }} {...objectives} />
            <Resource name="proficiency/questions" options={{ label: translate('questions.label') }} {...questions} />
            <Resource
                name="universities"
                options={{ label: translate('universities.label') }}
                recordRepresentation="name"
                {...universities}
            />
            <Resource name="reports" options={{ label: translate('reports.label') }} {...reports} />
            <Resource
                name="reports/categories"
                options={{ label: translate('report_categories.label') }}
                {...reportCategories}
            />
        </Admin>
    );
};

export default App;
