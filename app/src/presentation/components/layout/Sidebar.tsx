import { IonIcon, IonItem, IonList } from '@ionic/react';
import { addOutline, alertCircleOutline } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { ConversationsSvg, HomeSvg, LearningSvg, ProfileSvg } from '../../../assets';
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
                        alt=""
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
                        alt=""
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
                        alt=""
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
                        alt=""
                        src={ProfileSvg}
                        aria-hidden={true}
                        className={`${styles.image} ${location.pathname === '/profile' ? styles.imageActive : ''}`}
                    />
                    <span className={styles.title}>{t('navigation.sidebar.profile')}</span>
                    {location.pathname === '/profile' && <div className={styles.light}></div>}
                </IonItem>
                <div className={styles.separator}></div>
                <IonItem button={true} className={styles.line} id="click-trigger-new">
                    <IonIcon icon={addOutline} size="large" aria-hidden={true} />
                    <span className={styles.title}>{t('navigation.sidebar.new.title')}</span>
                </IonItem>
                <div className={styles.separator}></div>
                <IonItem className={styles['report-container']} onClick={onDisplayReport} button>
                    <IonIcon className="margin-right" icon={alertCircleOutline} size="large" aria-hidden={true} />
                    <span>{t('home_page.report.report_button')}</span>
                </IonItem>
            </IonList>
            <MenuNew
                className={styles.menuNew}
                onVocabularyPressed={onDisplayVocabularySidebar}
                onLearningDiaryPressed={onDisplayLearningDiary}
                onSessionPressed={onDisplaySessionModal}
                onActivityPressed={onDisplayActivitySidebar}
                trigger="click-trigger-new"
            />
        </>
    );
};

export default Sidebar;
