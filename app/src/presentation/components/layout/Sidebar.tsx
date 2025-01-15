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
                    className={styles.line}
                    onClick={navigateToHome}
                    color={location.pathname === '/home' ? 'light' : undefined}
                >
                    <img alt="" src={HomeSvg} aria-hidden={true} className={styles.image} />
                    <span className={styles.title}>{t('navigation.sidebar.home')}</span>
                </IonItem>
                <IonItem
                    button={true}
                    className={styles.line}
                    onClick={navigateToLearning}
                    color={location.pathname === '/learning' ? 'light' : undefined}
                >
                    <img alt="" src={LearningSvg} aria-hidden={true} className={styles.image} />
                    <span className={styles.title}>{t('navigation.sidebar.learning')}</span>
                </IonItem>
                <IonItem
                    button={true}
                    className={styles.line}
                    onClick={navigateToConversations}
                    color={location.pathname === '/conversations' ? 'light' : undefined}
                >
                    <img alt="" src={ConversationsSvg} aria-hidden={true} className={styles.image} />
                    <span className={styles.title}>{t('navigation.sidebar.conversations')}</span>
                </IonItem>
                <IonItem button={true} className={styles.line} onClick={navigateToProfile}>
                    <img alt="" src={ProfileSvg} aria-hidden={true} className={styles.image} />
                    <span className={styles.title}>{t('navigation.sidebar.profile')}</span>
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
