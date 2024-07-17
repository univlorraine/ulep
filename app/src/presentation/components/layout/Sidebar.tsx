import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ConversationsSvg, HomeSvg } from '../../../assets';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const navigateToHome = () => {
        history.push('/home');
    };

    const navigateToConversations = () => {
        history.push('/conversations');
    };

    return (
        <div className={styles.container}>
            <button className={styles.line} onClick={navigateToHome}>
                <img alt="" src={HomeSvg} aria-hidden={true} />
                <span className={styles.title}>{t('navigation.sidebar.home')}</span>
            </button>

            <button className={styles.line} onClick={navigateToConversations}>
                <img alt="" src={ConversationsSvg} aria-hidden={true} />
                <span className={styles.title}>{t('navigation.sidebar.conversations')}</span>
            </button>
        </div>
    );
};

export default Sidebar;
