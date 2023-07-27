import { IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';
import ConnectPage from '../pages/ConnectPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ForgotPasswordSentPage from '../pages/ForgotPasswordSentPage';
import Home from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import PairingConfirmLanguagePage from '../pages/PairingConfirmLanguagePage';
import PairingLaguagesPage from '../pages/PairingLaguagesPage';
import PairingLevelPage from '../pages/PairingLevelPage';
import PairingOtherLanguagesPage from '../pages/PairingOtherLanguagesPage';
import PairingPedagogyPage from '../pages/PairingPedagogyPage';
import PairingPreferencePage from '../pages/PairingPreferencePage';
import PairingQuizzEndPage from '../pages/PairingQuizzEndPage';
import PairingQuizzIntroductionPage from '../pages/PairingQuizzIntroductionPage';
import PairingQuizzPage from '../pages/PairingQuizzPage';
import PairingSelectCEFRPage from '../pages/PairingSelectCEFRPage';
import PairingUnavailableLanguagePage from '../pages/PairingUnavailableLanguagePage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import SignUpAvailabilitiesPage from '../pages/SignUpAvailabilitiesPage';
import SignUpBiographyPage from '../pages/SignUpBiographyPage';
import SignupFinalPage from '../pages/SignUpFinalPage';
import SignUpFrequencyPage from '../pages/SignUpFrequencyPage';
import SignUpGoals from '../pages/SignUpGoalsPage';
import SignUpInformationsPage from '../pages/SignUpInformationsPage';
import SignUpInterestsPage from '../pages/SignUpInterestsPage';
import SignUpLanguagesPage from '../pages/SignUpLanguagesPage';
import SignUpPage from '../pages/SignUpPage';

const OfflineRouter: React.FC = () => (
    <IonRouterOutlet>
        <Route exact path="/">
            <Home />
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
        <Route exact path="/signup/pairing/languages">
            <PairingLaguagesPage />
        </Route>
        <Route exact path="/signup/pairing/pedagogy">
            <PairingPedagogyPage />
        </Route>
        <Route exact path="/signup/pairing/language/confirm">
            <PairingConfirmLanguagePage />
        </Route>
        <Route exact path="/signup/pairing/level">
            <PairingLevelPage />
        </Route>
        <Route exact path="/signup/pairing/other-languages">
            <PairingOtherLanguagesPage />
        </Route>
        <Route exact path="/signup/pairing/preference">
            <PairingPreferencePage />
        </Route>
        <Route exact path="/signup/pairing/language/quizz/end">
            <PairingQuizzEndPage />
        </Route>
        <Route exact path="/signup/pairing/language/quizz/introduction">
            <PairingQuizzIntroductionPage />
        </Route>
        <Route exact path="/signup/pairing/language/quizz">
            <PairingQuizzPage />
        </Route>
        <Route exact path="/signup/pairing/level/select">
            <PairingSelectCEFRPage />
        </Route>
        <Route exact path="/signup/pairing/unavailable-language">
            <PairingUnavailableLanguagePage />
        </Route>
        <Route exact path="/reset-password/:id">
            <ResetPasswordPage />
        </Route>
        <Route exact path="/signup">
            <SignUpPage />
        </Route>
        <Route exact path="/signup/availabilities">
            <SignUpAvailabilitiesPage />
        </Route>
        <Route exact path="/signup/biography">
            <SignUpBiographyPage />
        </Route>
        <Route exact path="/signup/frequency">
            <SignUpFrequencyPage />
        </Route>
        <Route exact path="/signup/end">
            <SignupFinalPage />
        </Route>
        <Route exact path="/signup/goals">
            <SignUpGoals />
        </Route>
        <Route exact path="/signup/interests">
            <SignUpInterestsPage />
        </Route>
        <Route exact path="/signup/languages">
            <SignUpLanguagesPage />
        </Route>
        <Route exact path="/signup/informations">
            <SignUpInformationsPage />
        </Route>
    </IonRouterOutlet>
);

export default OfflineRouter;
