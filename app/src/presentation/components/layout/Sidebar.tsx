import React from 'react';
import { HomeSvg, ConversationsSvg } from '../../../assets';
import styles from './Sidebar.module.css';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

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
                <img alt="" src={HomeSvg} />
                <span className={styles.title}>{t('navigation.sidebar.home')}</span>
            </button>

            <button className={styles.line} onClick={navigateToConversations}>
                <img alt="" src={ConversationsSvg} />
                <span className={styles.title}>{t('navigation.sidebar.conversations')}</span>
            </button>
        </div>
    );
};

export default Sidebar;
