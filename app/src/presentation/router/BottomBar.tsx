import { IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { ConversationsSvg, HomeSvg, LearningSvg, ProfileSvg } from '../../assets';
import MenuNew from '../components/MenuNew';
import NewActivityMenuModal from '../components/modals/NewActivityMenuModal';
import NewSessionMenuModal from '../components/modals/NewSessionMenuModal';
import NewVocabularyMenuModal from '../components/modals/NewVocabularyMenuModal';
import ConversationsPage from '../pages/ConversationsPage';
import HomePage from '../pages/HomePage';
import LearningPage from '../pages/LearningPage';
import ProfilePage from '../pages/ProfilePage';
import styles from './BottomBar.module.css';
import PrivateRoute from './PrivateRoute';

const BottomBar: React.FC = () => {
    const { t } = useTranslation();

    const [isMenuNewVisible, setIsMenuNewVisible] = useState(false);

    const [showVocabularyModal, setShowVocabularyModal] = useState<boolean>(false);
    const [showActivityModal, setShowActivityModal] = useState<boolean>(false);
    const [showSessionModal, setShowSessionModal] = useState<boolean>(false);

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
                <IonTabBar slot="bottom" className={styles.bottomBar} onClick={() => setIsMenuNewVisible(false)}>
                    <IonTabButton tab="home" href="/home">
                        <img alt="Home" src={HomeSvg} />
                        <span>{t('navigation.bottom_bar.home')}</span>
                    </IonTabButton>
                    <IonTabButton tab="learning" href="/learning">
                        <img alt="Conversations" src={LearningSvg} />
                        <span>{t('navigation.bottom_bar.learning')}</span>
                    </IonTabButton>
                    <IonTabButton className={styles.newIcon_button}>
                        <div className={styles.newIcon_container}></div>
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
            <div
                className={`${styles.newIcon} ${isMenuNewVisible ? styles.active : ''}`}
                onClick={() => setIsMenuNewVisible(!isMenuNewVisible)}
                id="click-trigger-new-mobile"
                role="button"
            >
                <IonIcon icon={addOutline} color="black" size="large" />
            </div>
            <MenuNew
                className={styles.menuNew}
                setIsMenuVisible={setIsMenuNewVisible}
                onVocabularyPressed={() => setShowVocabularyModal(true)}
                onLearningDiaryPressed={() => {}}
                onSessionPressed={() => setShowSessionModal(true)}
                onActivityPressed={() => setShowActivityModal(true)}
                trigger="click-trigger-new-mobile"
                isMenuOpen={isMenuNewVisible}
            />
            <NewVocabularyMenuModal
                isVisible={showVocabularyModal}
                onClose={() => setShowVocabularyModal(false)}
                isHybrid
            />
            <NewActivityMenuModal isVisible={showActivityModal} onClose={() => setShowActivityModal(false)} isHybrid />
            <NewSessionMenuModal isVisible={showSessionModal} onClose={() => setShowSessionModal(false)} />
        </PrivateRoute>
    );
};

export default BottomBar;
