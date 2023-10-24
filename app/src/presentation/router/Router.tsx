import { IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';
import ConnectPage from '../pages/ConnectPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ForgotPasswordSentPage from '../pages/ForgotPasswordSentPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import PairingConfirmLanguagePage from '../pages/PairingConfirmLanguagePage';
import PairingFinalPage from '../pages/PairingFinalPage';
import PairingLaguagesPage from '../pages/PairingLaguagesPage';
import PairingLevelPage from '../pages/PairingLevelPage';
import PairingOptionsPage from '../pages/PairingOptionsPage';
import PairingOtherLanguagesPage from '../pages/PairingOtherLanguagesPage';
import PairingPedagogyPage from '../pages/PairingPedagogyPage';
import PairingPreferencePage from '../pages/PairingPreferencePage';
import PairingQuizzEndPage from '../pages/PairingQuizzEndPage';
import PairingQuizzIntroductionPage from '../pages/PairingQuizzIntroductionPage';
import PairingQuizzPage from '../pages/PairingQuizzPage';
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
import AppUrlListener from './AppUrlListener';

const OfflineRouter: React.FC = () => {
    const profile = useStoreState((store) => store.profile);

    if (profile && profile.user.status === 'BANNED') {
        return <SuspendedPage />;
    }

    return (
        <IonRouterOutlet>
            <AppUrlListener />
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
            <PrivateRoute exact component={HomePage} path="/home" />
            <MobileRoute exact component={TandemProfilePage} path={'/tandem-profil'} />
            <MobileRoute exact component={ProfilePage} path={'/profil'} />
            <MobileRoute exact component={ReportPage} path={'/report'} />
            <MobileRoute exact component={SettingsPage} path={'/settings'} />
            <MobileRoute exact component={TandemStatusPage} path={'/tandem-status'} />
            <PrivateRoute exact component={PairingLaguagesPage} path="/pairing/languages" />
            <PrivateRoute exact component={PairingOptionsPage} path="/pairing/options" />
            <PrivateRoute exact component={PairingPedagogyPage} path="/pairing/pedagogy" />
            <PrivateRoute exact component={PairingConfirmLanguagePage} path="/pairing/language/confirm" />
            <PrivateRoute exact component={PairingFinalPage} path="/pairing/end" />
            <PrivateRoute exact component={PairingLevelPage} path="/pairing/level" />
            <PrivateRoute exact component={PairingLevelStartPage} path="/pairing/level/start" />
            <PrivateRoute exact component={PairingOtherLanguagesPage} path="/pairing/other-languages" />
            <PrivateRoute exact component={PairingOtherLanguageSelectedPage} path="/pairing/other-languages/selected" />
            <PrivateRoute exact component={PairingPreferencePage} path="/pairing/preference" />
            <PrivateRoute exact component={PairingQuizzEndPage} path="/pairing/language/quizz/end" />
            <PrivateRoute exact component={PairingQuizzIntroductionPage} path="/pairing/language/quizz/introduction" />
            <PrivateRoute exact component={PairingQuizzPage} path="/pairing/language/quizz" />
            <PrivateRoute exact component={PairingSelectCEFRPage} path="/pairing/level/select" />
            <PrivateRoute exact component={PairingUnavailableLanguagePage} path="/pairing/unavailable-language" />
            <PrivateRoute exact component={SignUpAvailabilitiesPage} path="/signup/availabilities" />
            <PrivateRoute exact component={SignUpBiographyPage} path="/signup/biography" />
            <PrivateRoute exact component={SignUpFrequencyPage} path="/signup/frequency" />
            <PrivateRoute exact component={SignupFinalPage} path="/signup/end" />
            <PrivateRoute exact component={SignUpGoalsPage} path="/signup/goals" />
            <PrivateRoute exact component={SignUpInterestsPage} path="/signup/interests" />
            <PrivateRoute exact component={SignUpLanguagesPage} path="/signup/languages" />
            <Route exact component={SignUpInformationsPage} path="/signup/informations" />
        </IonRouterOutlet>
    );
};

export default OfflineRouter;
