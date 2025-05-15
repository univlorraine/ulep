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

import { IonIcon, IonItem, IonList } from '@ionic/react';
import { addOutline, alertCircleOutline } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { ConversationsSvg, HomeSvg, LearningSvg, ProfileSvg } from '../../../assets';
import { useStoreState } from '../../../store/storeTypes';
import MenuNew from '../MenuNew';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onDisplayReport: () => void;
    onDisplayVocabularySidebar: () => void;
    onDisplayActivitySidebar: () => void;
    onDisplayLearningDiary: () => void;
    onOpenActivitySidebar: () => void;
    onDisplaySessionModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    onDisplayReport,
    onDisplayVocabularySidebar,
    onDisplayActivitySidebar,
    onDisplayLearningDiary,
    onDisplaySessionModal,
}) => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const profile = useStoreState((state) => state.profile);

    const navigateToHome = () => {
        history.push('/home');
    };

    const navigateToConversations = () => {
        history.push('/conversations');
    };

    const navigateToLearning = () => {
        history.push('/learning');
    };

    const navigateToProfile = () => {
        history.push('/profile');
    };

    const hasLearningLanguages = profile && profile.learningLanguages && profile.learningLanguages.length >= 1;

    return (
        <>
            <IonList lines="none" className={styles.container}>
                <IonItem
                    button={true}
                    className={`${styles.line} ${location.pathname === '/home' ? styles.active : ''}`}
                    onClick={navigateToHome}
                    color={location.pathname === '/home' ? 'dark' : undefined}
                >
                    <img
                        alt={t('navigation.sidebar.home') as string}
                        src={HomeSvg}
                        aria-hidden={true}
                        className={`${styles.image} ${location.pathname === '/home' ? styles.imageActive : ''}`}
                    />
                    <span className={styles.title}>{t('navigation.sidebar.home')}</span>
                    {location.pathname === '/home' && <div className={styles.light}></div>}
                </IonItem>
                <IonItem
                    button={true}
                    className={`${styles.line} ${location.pathname === '/learning' ? styles.active : ''}`}
                    onClick={navigateToLearning}
                    color={location.pathname === '/learning' ? 'dark' : undefined}
                >
                    <img
                        alt={t('navigation.sidebar.learning') as string}
                        src={LearningSvg}
                        aria-hidden={true}
                        className={`${styles.image} ${location.pathname === '/learning' ? styles.imageActive : ''}`}
                    />
                    <span className={styles.title}>{t('navigation.sidebar.learning')}</span>
                    {location.pathname === '/learning' && <div className={styles.light}></div>}
                </IonItem>
                <IonItem
                    button={true}
                    className={`${styles.line} ${location.pathname === '/conversations' ? styles.active : ''}`}
                    onClick={navigateToConversations}
                    color={location.pathname === '/conversations' ? 'dark' : undefined}
                >
                    <img
                        alt={t('navigation.sidebar.conversations') as string}
                        src={ConversationsSvg}
                        aria-hidden={true}
                        className={`${styles.image} ${location.pathname === '/conversations' ? styles.imageActive : ''}`}
                    />
                    <span className={styles.title}>{t('navigation.sidebar.conversations')}</span>
                    {location.pathname === '/conversations' && <div className={styles.light}></div>}
                </IonItem>
                <IonItem
                    button={true}
                    className={`${styles.line} ${location.pathname === '/profile' ? styles.active : ''}`}
                    onClick={navigateToProfile}
                    color={location.pathname === '/profile' ? 'dark' : undefined}
                >
                    <img
                        alt={t('navigation.sidebar.profile') as string}
                        src={ProfileSvg}
                        aria-hidden={true}
                        className={`${styles.image} ${location.pathname === '/profile' ? styles.imageActive : ''}`}
                    />
                    <span className={styles.title}>{t('navigation.sidebar.profile')}</span>
                    {location.pathname === '/profile' && <div className={styles.light}></div>}
                </IonItem>
                <div className={styles.separator}></div>
                {hasLearningLanguages && (
                    <>
                        <IonItem button={true} className={styles.line} id="click-trigger-new">
                            <IonIcon icon={addOutline} size="large" aria-hidden={true} />
                            <span className={styles.title}>{t('navigation.sidebar.new.title')}</span>
                        </IonItem>
                        <div className={styles.separator}></div>
                    </>
                )}
                <IonItem className={styles['report-container']} onClick={onDisplayReport} button>
                    <IonIcon className="margin-right" icon={alertCircleOutline} size="large" aria-hidden={true} />
                    <span>{t('home_page.report.report_button')}</span>
                </IonItem>
            </IonList>
            {hasLearningLanguages && (
                <MenuNew
                    className={styles.menuNew}
                    onVocabularyPressed={onDisplayVocabularySidebar}
                    onLearningDiaryPressed={onDisplayLearningDiary}
                    onSessionPressed={onDisplaySessionModal}
                    onActivityPressed={onDisplayActivitySidebar}
                    trigger="click-trigger-new"
                />
            )}
        </>
    );
};

export default Sidebar;
