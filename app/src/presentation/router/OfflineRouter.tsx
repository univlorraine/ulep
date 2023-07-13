import { IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';
import ConnectPage from '../pages/ConnectPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ForgotPasswordSentPage from '../pages/ForgotPasswordSentPage';
import Home from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import SignUpInformationsPage from '../pages/SignUpInformationsPage';
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
        <Route exact path="/reset-password/:id">
            <ResetPasswordPage />
        </Route>
        <Route exact path="/signup">
            <SignUpPage />
        </Route>

        <Route exact path="/signup/informations">
            <SignUpInformationsPage />
        </Route>
    </IonRouterOutlet>
);

export default OfflineRouter;
