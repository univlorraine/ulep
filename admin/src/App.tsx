import ChatIcon from '@mui/icons-material/Chat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import HelpIcon from '@mui/icons-material/Help';
import InterestsIcon from '@mui/icons-material/Interests';
import LanguageIcon from '@mui/icons-material/Language';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PublicIcon from '@mui/icons-material/Public';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Route } from 'react-router-dom';
import CustomLayout from './components/layout/layout';
import { Role } from './entities/Administrator';
import activities from './pages/activities';
import activityCategories from './pages/activity-categories';
import activityThemes from './pages/activity-themes';
import EditAdministratorProfile from './pages/admin-profile/edit';
import administrators from './pages/administrators';
import LoginPage from './pages/auth/login';
import campus from './pages/campus';
import categoryInterest from './pages/category-interest';
import chat from './pages/chat';
import countSuggestedLanguages from './pages/count-suggested-languages';
import countries from './pages/countries';
import instance from './pages/instance';
import interests from './pages/interests';
import JitsiPage from './pages/jitsi/JitsiPage';
import languages from './pages/languages';
import news from './pages/news';
import objectives from './pages/objectives';
import profiles from './pages/profiles';
import profilesWithTandem from './pages/profiles-with-tandems-profiles';
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

const App = () => (
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
                    list={profiles.list}
                    name="profiles"
                    options={{ label: 'profiles.label' }}
                    show={profiles.show}
                />
                <Resource
                    icon={PeopleIcon}
                    name="profiles/with-tandems-profiles"
                    options={{ label: 'learning_languages.label' }}
                    {...profilesWithTandem}
                />
                <Resource name="learning-languages" />
                <Resource
                    icon={WarningAmberOutlinedIcon}
                    name="reports"
                    options={{ label: 'reports.label' }}
                    {...reports}
                />
                <Resource icon={ChatIcon} name="chat" options={{ label: 'chat.label' }} {...chat} />
                <Resource icon={NewspaperIcon} name="news" options={{ label: 'news.label' }} {...news} />
                <Resource
                    icon={EditNoteIcon}
                    name="activities"
                    options={{ label: 'activities.label' }}
                    {...activities}
                />
                {permissions.checkRole(Role.MANAGER) && (
                    <Resource
                        edit={universities.manager.edit}
                        name="universities"
                        options={{ label: 'universities.label' }}
                        recordRepresentation="name"
                        show={universities.manager.show}
                    />
                )}
                {permissions.checkRoles([Role.MANAGER, Role.SUPER_ADMIN]) && (
                    <>
                        <Resource
                            icon={PersonIcon}
                            name="users/administrators"
                            options={{ label: 'administrators.label' }}
                            {...administrators}
                        />
                        <Resource
                            icon={PersonAddIcon}
                            name="profiles"
                            options={{ label: 'profiles.label' }}
                            {...profiles}
                        />
                    </>
                )}
                {permissions.checkRole(Role.SUPER_ADMIN) && (
                    <>
                        <Resource
                            icon={SettingsIcon}
                            name="instance"
                            options={{ label: 'instance.label' }}
                            {...instance}
                        />
                        <Resource
                            icon={PublicIcon}
                            name="countries"
                            options={{ label: 'countries.label' }}
                            {...countries}
                        />
                        <Resource
                            icon={LanguageIcon}
                            name="languages"
                            options={{ label: 'languages.label' }}
                            {...languages}
                        />
                        <Resource
                            icon={LanguageIcon}
                            name="languages/requests"
                            options={{ label: 'suggested_languages.label' }}
                            {...suggestedLanguages}
                        />
                        <Resource
                            icon={LanguageIcon}
                            name="languages/requests/count"
                            options={{ label: 'count_suggested_languages.label' }}
                            {...countSuggestedLanguages}
                        />
                        <Resource
                            icon={InterestsIcon}
                            name="interests"
                            options={{ label: 'interests.label' }}
                            {...interests}
                        />
                        <Resource
                            icon={InterestsIcon}
                            name="interests/categories"
                            options={{ label: 'interest_categories.label' }}
                            {...categoryInterest}
                        />
                        <Resource
                            name="activities/categories"
                            options={{ label: 'interest_categories.label' }}
                            {...activityCategories}
                        />
                        <Resource name="activities/themes" {...activityThemes} />
                        <Resource
                            icon={CheckCircleIcon}
                            name="objectives"
                            options={{ label: 'objectives.label' }}
                            {...objectives}
                        />
                        <Resource
                            icon={SchoolOutlinedIcon}
                            name="campus"
                            options={{ label: 'campus.label' }}
                            {...campus}
                        />
                        <Resource
                            icon={HelpIcon}
                            name="proficiency/questions"
                            options={{ label: 'questions.label' }}
                            {...questions}
                        />
                        <Resource
                            icon={SchoolOutlinedIcon}
                            name="universities"
                            options={{ label: 'universities.label' }}
                            recordRepresentation="name"
                            {...universities}
                        />
                        <Resource
                            icon={WarningAmberOutlinedIcon}
                            name="reports/categories"
                            options={{ label: 'report_categories.label' }}
                            {...reportCategories}
                        />
                    </>
                )}
                <CustomRoutes>
                    <Route element={<JitsiPage />} path="/jitsi" />
                </CustomRoutes>
            </>
        )}
    </Admin>
);

export default App;
