import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import InterestsIcon from '@mui/icons-material/Interests';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PublicIcon from '@mui/icons-material/Public';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import React from 'react';
import { Admin, Resource, useTranslate } from 'react-admin';
import CustomLayout from './components/layout/layout';
import { Role } from './entities/Administrator';
import EditAdministratorProfile from './pages/admin-profile/edit';
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
import profilesWithTandem from './pages/profiles-with-tandem';
import questions from './pages/questions';
import reports from './pages/report';
import reportCategories from './pages/report-categories';
import suggestedLanguages from './pages/suggested-languages';
import universities from './pages/universities';
import authProvider, { GetPermissionsInterface } from './providers/authProvider';
import customDataProvider from './providers/customDataProvider';
import i18nProvider from './providers/i18nProvider';
import queryClient from './queryClient';
import theme from './theme/theme';

const App = () => {
    const translate = useTranslate();

    return (
        <Admin
            authProvider={authProvider}
            dataProvider={customDataProvider}
            i18nProvider={i18nProvider}
            layout={CustomLayout}
            loginPage={LoginPage}
            queryClient={queryClient}
            theme={theme}
            requireAuth
        >
            {(permissions: GetPermissionsInterface) => (
                <>
                    <Resource edit={EditAdministratorProfile} name="admin-profile" />
                    <Resource
                        icon={PersonAddIcon}
                        name="profiles"
                        options={{ label: translate('profiles.label') }}
                        {...profiles}
                    />
                    <Resource
                        icon={PeopleIcon}
                        name="learning-languages"
                        options={{ label: translate('learning_languages.label') }}
                        {...learningLanguages}
                    />
                    <Resource
                        icon={PeopleIcon}
                        name="profiles/with-tandem"
                        options={{ label: translate('learning_languages.label') }}
                        {...profilesWithTandem}
                    />
                    <Resource
                        icon={WarningAmberOutlinedIcon}
                        name="reports"
                        options={{ label: translate('reports.label') }}
                        {...reports}
                    />
                    <Resource
                        icon={PersonIcon}
                        name="users/administrators"
                        options={{ label: translate('administrators.label') }}
                        {...administrators}
                    />
                    {permissions.checkRole(Role.MANAGER) && (
                        <Resource
                            edit={universities.manager.edit}
                            name="universities"
                            options={{ label: translate('universities.label') }}
                            recordRepresentation="name"
                            show={universities.manager.show}
                        />
                    )}
                    {permissions.checkRole(Role.SUPER_ADMIN) && (
                        <>
                            <Resource
                                icon={SettingsIcon}
                                name="instance"
                                options={{ label: translate('instance.label') }}
                                {...instance}
                            />
                            <Resource
                                icon={PublicIcon}
                                name="countries"
                                options={{ label: translate('countries.label') }}
                                {...countries}
                            />
                            <Resource
                                icon={LanguageIcon}
                                name="languages"
                                options={{ label: translate('languages.label') }}
                                {...languages}
                            />
                            <Resource
                                icon={LanguageIcon}
                                name="languages/requests"
                                options={{ label: translate('suggested_languages.label') }}
                                {...suggestedLanguages}
                            />
                            <Resource
                                icon={LanguageIcon}
                                name="languages/requests/count"
                                options={{ label: translate('count_suggested_languages.label') }}
                                {...countSuggestedLanguages}
                            />
                            <Resource
                                icon={InterestsIcon}
                                name="interests"
                                options={{ label: translate('interests.label') }}
                                {...interests}
                            />
                            <Resource
                                icon={InterestsIcon}
                                name="interests/categories"
                                options={{ label: translate('interest_categories.label') }}
                                {...categoryInterest}
                            />
                            <Resource
                                icon={CheckCircleIcon}
                                name="objectives"
                                options={{ label: translate('objectives.label') }}
                                {...objectives}
                            />
                            <Resource
                                icon={SchoolOutlinedIcon}
                                name="campus"
                                options={{ label: translate('campus.label') }}
                                {...campus}
                            />
                            <Resource
                                icon={HelpIcon}
                                name="proficiency/questions"
                                options={{ label: translate('questions.label') }}
                                {...questions}
                            />
                            <Resource
                                icon={SchoolOutlinedIcon}
                                name="universities"
                                options={{ label: translate('universities.label') }}
                                recordRepresentation="name"
                                {...universities}
                            />
                            <Resource
                                icon={WarningAmberOutlinedIcon}
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
