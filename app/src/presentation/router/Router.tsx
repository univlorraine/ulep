import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ConnectPage from '../pages/ConnectPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ForgotPasswordSentPage from '../pages/ForgotPasswordSentPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import PairingConfirmLanguagePage from '../pages/PairingConfirmLanguagePage';
import PairingFinalPage from '../pages/PairingFinalPage';
import PairingLanguagesPage from '../pages/PairingLanguagesPage';
import PairingLevelPage from '../pages/PairingLevelPage';
import PairingOptionsPage from '../pages/PairingOptionsPage';
import PairingOtherLanguagesPage from '../pages/PairingOtherLanguagesPage';
import PairingPedagogyPage from '../pages/PairingPedagogyPage';
import PairingPreferencePage from '../pages/PairingPreferencePage';
import PairingQuizzEndPage from '../pages/PairingQuizzEndPage';
import PairingQuizzIntroductionPage from '../pages/PairingQuizzIntroductionPage';
import QuizzPage from '../pages/QuizzPage';
import PairingSelectCEFRPage from '../pages/PairingSelectCEFRPage';
import PairingUnavailableLanguagePage from '../pages/PairingUnavailableLanguagePage';
import SignUpAvailabilitiesPage from '../pages/SignUpAvailabilitiesPage';
import SignUpBiographyPage from '../pages/SignUpBiographyPage';
import SignupFinalPage from '../pages/SignUpFinalPage';
import SignUpFrequencyPage from '../pages/SignUpFrequencyPage';
import SignUpGoalsPage from '../pages/SignUpGoalsPage';
import SignUpInformationsPage from '../pages/SignUpInformationsPage';
import SignUpInterestsPage from '../pages/SignUpInterestsPage';
import AuthFlowPage from '../pages/AuthFlowPage';
import SignUpLanguagesPage from '../pages/SignUpLanguagesPage';
import SignUpPage from '../pages/SignUpPage';
import WelcomePage from '../pages/WelcomePage';
import ProfilePage from '../pages/mobile/ProfilePage';
import ReportPage from '../pages/mobile/ReportPage';
import SettingsPage from '../pages/mobile/SettingsPage';
import TandemProfilePage from '../pages/mobile/TandemProfilePage';
import TandemStatusPage from '../pages/mobile/TandemStatusPage';
import MobileRoute from './MobileRoute';
import PrivateRoute from './PrivateRoute';
import PairingLevelStartPage from '../pages/PairingLevelStartPage';
import { useStoreState } from '../../store/storeTypes';
import SuspendedPage from '../pages/SuspendedPage';
import PairingOtherLanguageSelectedPage from '../pages/PairingOtherLanguageSelectedPage';
import useIsUniversityOpen from '../hooks/useIsUniversityOpen';
import ServiceClosePage from '../pages/ServiceClosePage';
import EditInformationsPage from '../pages/EditInformationsPage';
import CEFRQuizzLanguagePage from '../pages/cefr-quizz/CEFRQuizzLanguagePage';
import CEFRQuizzOtherLanguagesPage from '../pages/cefr-quizz/CEFRQuizzOtherLanguagesPage';
import CEFRQuizzEndPage from '../pages/cefr-quizz/CEFRQuizzEndPage';
import BottomBar from './BottomBar';
import { useConfig } from '../../context/ConfigurationContext';
import ConversationsPage from '../pages/ConversationsPage';

const OfflineRouter: React.FC = () => {
    const { deviceAdapter } = useConfig();
    const profile = useStoreState((store) => store.profile);
    const { openDate, closeDate, isUniversityOpen } = useIsUniversityOpen(profile?.user.university.id, [
        profile?.user.university.id,
    ]);

    if (profile && (profile.user.status === 'BANNED' || profile.user.status === 'CANCELED')) {
        return <SuspendedPage status={profile.user.status} />;
    }

    if (!isUniversityOpen && openDate && closeDate) {
        return <ServiceClosePage openDate={openDate} closeDate={closeDate} />;
    }

    return (
        <IonRouterOutlet>
            <Switch>
                <Route exact path="/">
                    <WelcomePage />
                </Route>
                <Route exact path="/connect">
                    <ConnectPage />
                </Route>
                <Route exact path="/forgot-password">
                    <ForgotPasswordPage />
                </Route>
                <Route exact path="/forgot-password/sent">
                    <ForgotPasswordSentPage />
                </Route>
                <Route exact path="/login">
                    <LoginPage />
                </Route>
                <Route exact path="/signup">
                    <SignUpPage />
                </Route>
                <Route exact path="/auth">
                    <AuthFlowPage />
                </Route>
                <MobileRoute exact path={'/tandem-profil'}>
                    <TandemProfilePage />
                </MobileRoute>
                <MobileRoute exact path={'/profil'}>
                    <ProfilePage />
                </MobileRoute>
                <MobileRoute exact path={'/report'}>
                    <ReportPage />
                </MobileRoute>
                <MobileRoute exact path={'/settings'}>
                    <SettingsPage />
                </MobileRoute>
                <MobileRoute exact path={'/tandem-status'}>
                    <TandemStatusPage />
                </MobileRoute>
                <PrivateRoute exact path="/pairing/languages">
                    <PairingLanguagesPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/options">
                    <PairingOptionsPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/pedagogy">
                    <PairingPedagogyPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/language/confirm">
                    <PairingConfirmLanguagePage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/end">
                    <PairingFinalPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/level">
                    <PairingLevelPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/level/start">
                    <PairingLevelStartPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/other-languages">
                    <PairingOtherLanguagesPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/other-languages/selected">
                    <PairingOtherLanguageSelectedPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/preference">
                    <PairingPreferencePage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/language/quizz/end">
                    <PairingQuizzEndPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/language/quizz/introduction">
                    <PairingQuizzIntroductionPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/language/quizz">
                    <QuizzPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/level/select">
                    <PairingSelectCEFRPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/unavailable-language">
                    <PairingUnavailableLanguagePage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/availabilities">
                    <SignUpAvailabilitiesPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/biography">
                    <SignUpBiographyPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/frequency">
                    <SignUpFrequencyPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/end">
                    <SignupFinalPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/goals">
                    <SignUpGoalsPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/interests">
                    <SignUpInterestsPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/languages">
                    <SignUpLanguagesPage />
                </PrivateRoute>
                <Route exact path="/signup/informations">
                    <SignUpInformationsPage />
                </Route>
                <Route exact path="/edit/informations">
                    <EditInformationsPage />
                </Route>
                {/* Quizz route */}
                <PrivateRoute exact path="/cefr/languages">
                    <CEFRQuizzLanguagePage />
                </PrivateRoute>
                <PrivateRoute exact path="/cefr/languages/other">
                    <CEFRQuizzOtherLanguagesPage />
                </PrivateRoute>
                <PrivateRoute exact path="/cefr/quizz">
                    <QuizzPage />
                </PrivateRoute>
                <PrivateRoute exact path="/cefr/quizz/end">
                    <CEFRQuizzEndPage />
                </PrivateRoute>
                {/* Bottom bar for native platform */}
                {deviceAdapter.isNativePlatform() && <BottomBar />}
                {/* Routes for web platform */}
                {!deviceAdapter.isNativePlatform() && (
                    <>
                        <PrivateRoute exact path="/home">
                            <HomePage />
                        </PrivateRoute>
                        <PrivateRoute exact path="/conversations">
                            <ConversationsPage />
                        </PrivateRoute>
                    </>
                )}
            </Switch>
        </IonRouterOutlet>
    );
};

export default OfflineRouter;
