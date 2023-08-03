import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import Dropdown from '../DropDown';
import styles from './SettingsContent.module.css';

interface SettingsContentProps {
    onBackPressed: () => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ onBackPressed }) => {
    const { t } = useTranslation();
    const [notificationStatus, setNotificationStatus] = useState<boolean>(true);

    return (
        <div className={styles.container}>
            <button className={styles['back-button']} onClick={onBackPressed}>
                <img alt="arrow-left" src="/assets/left-arrow.svg" />
            </button>
            <h1 className={styles.title}>{t('home_page.settings.title')}</h1>

            <div className="large-margin-vertical">
                <Dropdown
                    onChange={() => null}
                    options={[
                        { title: 'Français', value: 'Français' },
                        { title: 'English', value: 'English' },
                        { title: 'Chinease', value: 'Chinease' },
                    ]}
                    title={t('home_page.settings.language')}
                />
            </div>
            <span className={styles.subtitle}>{t('home_page.settings.other')}</span>
            <button className={styles['setting-container']}>
                <span>{t('home_page.settings.notifications')}</span>
                <Switch
                    onChange={setNotificationStatus}
                    checked={notificationStatus}
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
            </button>
            <a className={styles['setting-container']}>
                <span>{t('home_page.settings.confidentiality')}</span>
                <img alt="right-arrow" src="/assets/arrow-right.svg" />
            </a>
            <a className={`${styles['setting-container']} large-margin-bottom`}>
                <span>{t('home_page.settings.CGU')}</span>
                <img alt="right-arrow" src="/assets/arrow-right.svg" />
            </a>

            <span className={styles.subtitle}>{t('home_page.settings.account')}</span>
            <button className={styles['setting-container']}>
                <span>{t('home_page.settings.unsubscribe')}</span>
                <img alt="right-arrow" src="/assets/arrow-right.svg" />
            </button>
            <button className={styles['setting-container']}>
                <span>{t('home_page.settings.logout')}</span>
                <img alt="right-arrow" src="/assets/arrow-right.svg" />
            </button>
        </div>
    );
};

export default SettingsContent;
