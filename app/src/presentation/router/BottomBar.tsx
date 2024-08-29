import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { ConversationsSvg, HomeSvg, LearningSvg, ProfileSvg } from '../../assets';
import ConversationsPage from '../pages/ConversationsPage';
import HomePage from '../pages/HomePage';
import LearningPage from '../pages/LearningPage';
import ProfilePage from '../pages/mobile/ProfilePage';
import PrivateRoute from './PrivateRoute';

const BottomBar: React.FC = () => {
    const { t } = useTranslation();

    return (
        <PrivateRoute path="/(home|conversations|learning|profile)">
            <IonTabs>
                <IonRouterOutlet>
                    <Switch>
                        <Route exact path="/home">
                            <HomePage />
                        </Route>
                        <Route exact path="/conversations">
                            <ConversationsPage />
                        </Route>
                        <Route exact path="/learning">
                            <LearningPage />
                        </Route>
                        <Route exact path="/profile">
                            <ProfilePage />
                        </Route>
                    </Switch>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="home" href="/home">
                        <img alt="Home" src={HomeSvg} />
                        <span>{t('navigation.bottom_bar.home')}</span>
                    </IonTabButton>
                    <IonTabButton tab="learning" href="/learning">
                        <img alt="Conversations" src={LearningSvg} />
                        <span>{t('navigation.bottom_bar.learning')}</span>
                    </IonTabButton>
                    <IonTabButton tab="conversations" href="/conversations">
                        <img alt="Conversations" src={ConversationsSvg} />
                        <span>{t('navigation.bottom_bar.conversations')}</span>
                    </IonTabButton>
                    <IonTabButton tab="profile" href="/profile">
                        <img alt="Conversations" src={ProfileSvg} />
                        <span>{t('navigation.bottom_bar.profile')}</span>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </PrivateRoute>
    );
};

export default BottomBar;
