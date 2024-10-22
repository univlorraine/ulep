import { IonIcon, IonItem, IonList } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { ConversationsSvg, DisconnectSvg, HomeSvg, LearningSvg, ProfileSvg, SettingsPng } from '../../../assets';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onDisconnect: () => void;
    onDisplaySettings: () => void;
    onDisplayReport: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDisconnect, onDisplaySettings, onDisplayReport }) => {
    const history = useHistory();
    const { t } = useTranslation();
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
            <IonItem button={true} className={styles.line} onClick={onDisplaySettings}>
                <img alt="" src={SettingsPng} aria-hidden={true} className={styles.image} />
                <span className={styles.title}>{t('navigation.sidebar.settings')}</span>
            </IonItem>
            <IonItem button={true} className={styles.line} onClick={onDisconnect}>
                <img alt="" src={DisconnectSvg} aria-hidden={true} className={styles.image} />
                <span className={styles.title}>{t('navigation.sidebar.disconnect')}</span>
            </IonItem>
            <IonItem className={styles['report-container']} onClick={onDisplayReport} button>
                <IonIcon className="margin-right" icon={alertCircleOutline} size="large" aria-hidden={true} />
                <span>{t('home_page.report.report_button')}</span>
            </IonItem>
        </IonList>
    );
};

export default Sidebar;
