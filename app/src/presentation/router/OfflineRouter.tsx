import { IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';
import ConnectPage from '../pages/ConnectPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ForgotPasswordSentPage from '../pages/ForgotPasswordSentPage';
import Home from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import PairingLaguages from '../pages/PairingLaguages';
import PairingOtherLanguagesPage from '../pages/PairingOtherLanguagesPage';
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
            <PairingLaguages />
        </Route>
        <Route exact path="/signup/pairing/other-languages">
            <PairingOtherLanguagesPage />
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
