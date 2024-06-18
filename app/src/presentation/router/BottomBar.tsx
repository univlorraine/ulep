import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Route } from 'react-router';
import ConversationsPage from '../pages/ConversationsPage';
import PrivateRoute from './PrivateRoute';
import { useTranslation } from 'react-i18next';
import { ConversationsSvg, HomeSvg } from '../../assets';
import HomePage from '../pages/HomePage';

const BottomBar: React.FC = () => {
    const { t } = useTranslation();

    return (
        <PrivateRoute path="/(home|conversations)">
            <IonTabs>
                <IonRouterOutlet>
                    <Route exact path="/home">
                        <HomePage />
                    </Route>
                    <Route exact path="/conversations">
                        <ConversationsPage />
                    </Route>
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
