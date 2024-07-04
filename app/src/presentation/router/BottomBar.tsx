import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { ConversationsSvg, HomeSvg } from '../../assets';
import ConversationsPage from '../pages/ConversationsPage';
import HomePage from '../pages/HomePage';
import PrivateRoute from './PrivateRoute';

const BottomBar: React.FC = () => {
    const { t } = useTranslation();

    return (
        <PrivateRoute path="/(home|conversations)">
            <IonTabs>
                <IonRouterOutlet>
                    <Switch>
                        <Route exact path="/home">
                            <HomePage />
                        </Route>
                        <Route exact path="/conversations">
                            <ConversationsPage />
                        </Route>
                    </Switch>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="home" href="/home">
                        <img alt="Home" src={HomeSvg} />
                        <span>{t('navigation.bottom_bar.home')}</span>
                    </IonTabButton>
                    <IonTabButton tab="conversations" href="/conversations">
                        <img alt="Conversations" src={ConversationsSvg} />
                        <span>{t('navigation.bottom_bar.conversations')}</span>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </PrivateRoute>
    );
};

export default BottomBar;
