import React from 'react';
import { Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import Home from '../pages/Home';
import { LoginPage } from '../pages/Login';

const OfflineRouter: React.FC = () => (
    <IonRouterOutlet>
        <Route exact path="/">
            <Home />
        </Route>
        <Route exact path="/login">
            <LoginPage />
        </Route>
    </IonRouterOutlet>
);

export default OfflineRouter;
