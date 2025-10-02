/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { ConversationsSvg, HomeSvg, LearningSvg, ProfileSvg } from '../../assets';
import { useStoreState } from '../../store/storeTypes';
import MenuNew from '../components/MenuNew';
import NewActivityMenuModal from '../components/modals/NewActivityMenuModal';
import NewLogEntryMenuModal from '../components/modals/NewLogEntryMenuModal';
import NewSessionMenuModal from '../components/modals/NewSessionMenuModal';
import NewVocabularyMenuModal from '../components/modals/NewVocabularyMenuModal';
import useLimitedFeatures from '../hooks/useLimitedFeatures';
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
    const [showLearningDiaryModal, setShowLearningDiaryModal] = useState<boolean>(false);
    const profile = useStoreState((state) => state.profile);
    const hasLearningLanguages = profile && profile.learningLanguages && profile.learningLanguages.length >= 1;
    const limitedFeatures = useLimitedFeatures();

    return (
        <PrivateRoute path="/(home|conversations|learning|profile)">
            <IonTabs>
                <IonRouterOutlet>
                    <Switch>
                        {!limitedFeatures && (
                            <>
                                <Route exact path="/home">
                                    <HomePage />
                                </Route>
                                <Route exact path="/conversations">
                                    <ConversationsPage />
                                </Route>
                            </>
                        )}
                        <Route exact path="/learning">
                            <LearningPage />
                        </Route>
                        <Route exact path="/profile">
                            <ProfilePage />
                        </Route>
                    </Switch>
                </IonRouterOutlet>

                <IonTabBar
                    slot="bottom"
                    className={styles.bottomBar}
                    onClick={() => setIsMenuNewVisible(false)}
                    role="navigation"
                >
                    {!limitedFeatures && (
                        <IonTabButton tab="home" href="/home">
                            <img alt="Home" src={HomeSvg} />
                            <span>{t('navigation.bottom_bar.home')}</span>
                        </IonTabButton>
                    )}
                    <IonTabButton tab="learning" href="/learning">
                        <img alt="Learning" src={LearningSvg} />
                        <span>{t('navigation.bottom_bar.learning')}</span>
                    </IonTabButton>
                    {!limitedFeatures && hasLearningLanguages && (
                        <IonTabButton className={styles.newIcon_button}>
                            <div className={styles.newIcon_container}></div>
                        </IonTabButton>
                    )}
                    {!limitedFeatures && (
                        <IonTabButton tab="conversations" href="/conversations">
                            <img alt="Conversations" src={ConversationsSvg} />
                            <span>{t('navigation.bottom_bar.conversations')}</span>
                        </IonTabButton>
                    )}
                    <IonTabButton tab="profile" href="/profile">
                        <img alt="Profile" src={ProfileSvg} />
                        <span>{t('navigation.bottom_bar.profile')}</span>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
            {!limitedFeatures && hasLearningLanguages && (
                <>
                    <div
                        className={`${styles.newIcon} ${isMenuNewVisible ? styles.active : ''}`}
                        onClick={() => setIsMenuNewVisible(!isMenuNewVisible)}
                        id="click-trigger-new-mobile"
                        role="button"
                        tabIndex={0}
                        aria-label={t('navigation.bottom_bar.new') as string}
                    >
                        <IonIcon icon={addOutline} color="black" size="large" />
                    </div>
                    <MenuNew
                        className={styles.menuNew}
                        setIsMenuVisible={setIsMenuNewVisible}
                        onVocabularyPressed={() => setShowVocabularyModal(true)}
                        onLearningDiaryPressed={() => setShowLearningDiaryModal(true)}
                        onSessionPressed={() => setShowSessionModal(true)}
                        onActivityPressed={() => setShowActivityModal(true)}
                        trigger="click-trigger-new-mobile"
                        isMenuOpen={isMenuNewVisible}
                    />
                </>
            )}
            {!limitedFeatures && (
                <>
                    <NewVocabularyMenuModal
                        isVisible={showVocabularyModal}
                        onClose={() => setShowVocabularyModal(false)}
                        isHybrid
                    />
                    <NewActivityMenuModal
                        isVisible={showActivityModal}
                        onClose={() => setShowActivityModal(false)}
                        isHybrid
                    />
                    <NewSessionMenuModal isVisible={showSessionModal} onClose={() => setShowSessionModal(false)} />
                    <NewLogEntryMenuModal
                        isVisible={showLearningDiaryModal}
                        onClose={() => setShowLearningDiaryModal(false)}
                        isHybrid
                    />
                </>
            )}
        </PrivateRoute>
    );
};

export default BottomBar;
