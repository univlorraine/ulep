import { IonItem, IonList } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { ConversationsSvg, HomeSvg } from '../../../assets';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const location = useLocation();

    const navigateToHome = () => {
        history.push('/home');
    };

    const navigateToConversations = () => {
        history.push('/conversations');
    };

    return (
        <IonList lines="none" className={styles.container}>
            <IonItem
                button={true}
                className={styles.line}
                onClick={navigateToHome}
                color={location.pathname === '/home' ? 'light' : undefined}
            >
                <img alt="" src={HomeSvg} aria-hidden={true} />
                <span className={styles.title}>{t('navigation.sidebar.home')}</span>
            </IonItem>
            <IonItem
                button={true}
                className={styles.line}
                onClick={navigateToConversations}
                color={location.pathname === '/conversations' ? 'light' : undefined}
            >
                <img alt="" src={ConversationsSvg} aria-hidden={true} />
                <span className={styles.title}>{t('navigation.sidebar.conversations')}</span>
            </IonItem>
        </IonList>
    );
};

export default Sidebar;
