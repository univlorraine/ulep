import React from 'react';
import { Admin, Resource, useTranslate } from 'react-admin';
import CustomLayout from './components/layout/layout';
import administrators from './pages/administrators';
import LoginPage from './pages/auth/login';
import campus from './pages/campus';
import categoryInterest from './pages/category-interest';
import countSuggestedLanguages from './pages/count-suggested-languages';
import countries from './pages/countries';
import instance from './pages/instance';
import interests from './pages/interests';
import languages from './pages/languages';
import learningLanguages from './pages/learning-languages';
import objectives from './pages/objectives';
import profiles from './pages/profiles';
import questions from './pages/questions';
import reports from './pages/report';
import reportCategories from './pages/report-categories';
import suggestedLanguages from './pages/suggested-languages';
import universities from './pages/universities';
import authProvider, { ADMIN_PERMISSION, SUPER_ADMIN_PERMISSION } from './providers/authProvider';
import customDataProvider from './providers/customDataProvider';
import i18nProvider from './providers/i18nProvider';
import theme from './theme/theme';

const App = () => {
    const translate = useTranslate();

    return (
        <Admin
            authProvider={authProvider()}
            dataProvider={customDataProvider}
            i18nProvider={i18nProvider}
            layout={CustomLayout}
            loginPage={LoginPage}
            theme={theme}
        >
            {(permissions) => (
                <>
                    <Resource name="profiles" options={{ label: translate('profiles.label') }} {...profiles} />
                    <Resource
                        name="learning-languages"
                        options={{ label: translate('learning_languages.label') }}
                        {...learningLanguages}
                    />
                    <Resource name="reports" options={{ label: translate('reports.label') }} {...reports} />
                    <Resource
                        name="users/administrators"
                        options={{ label: translate('administrators.label') }}
                        {...administrators}
                    />
                    {permissions === ADMIN_PERMISSION && (
                        <Resource
                            name="universities"
                            options={{ label: translate('universities.label') }}
                            recordRepresentation="name"
                            edit={universities.admin.edit}
                            show={universities.admin.show}
                        />
                    )}
                    {permissions === SUPER_ADMIN_PERMISSION && (
                        <>
                            <Resource name="instance" options={{ label: translate('instance.label') }} {...instance} />
                            <Resource
                                name="countries"
                                options={{ label: translate('countries.label') }}
                                {...countries}
                            />
                            <Resource
                                name="languages"
                                options={{ label: translate('languages.label') }}
                                {...languages}
                            />
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
                            <Resource
                                name="interests"
                                options={{ label: translate('interests.label') }}
                                {...interests}
                            />
                            <Resource
                                name="interests/categories"
                                options={{ label: translate('interest_categories.label') }}
                                {...categoryInterest}
                            />
                            <Resource
                                name="objectives"
                                options={{ label: translate('objectives.label') }}
                                {...objectives}
                            />
                            <Resource name="campus" options={{ label: translate('campus.label') }} {...campus} />
                            <Resource
                                name="proficiency/questions"
                                options={{ label: translate('questions.label') }}
                                {...questions}
                            />
                            <Resource
                                name="universities"
                                options={{ label: translate('universities.label') }}
                                recordRepresentation="name"
                                {...universities}
                            />
                            <Resource
                                name="reports/categories"
                                options={{ label: translate('report_categories.label') }}
                                {...reportCategories}
                            />
                        </>
                    )}
                </>
            )}
        </Admin>
    );
};

export default App;
