import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import { ArrowLeftSvg, ArrowRightSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../../store/storeTypes';
import Dropdown from '../DropDown';
import styles from './SettingsContent.module.css';

interface SettingsContentProps {
    onBackPressed: () => void;
    onDisconnect: () => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ onBackPressed, onDisconnect }) => {
    const { t } = useTranslation();
    const { askForAccountDeletion, updateNotificationPermission } = useConfig();
    const setLanguage = useStoreActions((state) => state.setLanguage);
    const currentLanguage = useStoreState((state) => state.language);
    const [showToast] = useIonToast();
    const [notificationStatus, setNotificationStatus] = useState<boolean>(true);

    const LANGUAGES = [
        { title: t('languages.french'), value: 'fr' },
        { title: t('languages.english'), value: 'en' },
        { title: t('languages.chinese'), value: 'cn' },
    ];

    const onDeletionAsked = async () => {
        const result = await askForAccountDeletion.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }
        return await showToast({ message: t('home_page.settings.deletion'), duration: 1000 });
    };

    //TODO: test this when api will be ready
    const onUpdateNotification = async () => {
        const result = await updateNotificationPermission.execute(!notificationStatus);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setNotificationStatus(true);
    };

    const updateLanguage = (code: string) => {
        setLanguage({ language: code });
    };

    return (
        <div className={styles.container}>
            <button className={styles['back-button']} onClick={onBackPressed}>
                <img alt="arrow-left" src={ArrowLeftSvg} />
            </button>
            <h1 className={styles.title}>{t('home_page.settings.title')}</h1>

            <div className="large-margin-vertical">
                <Dropdown
                    onChange={updateLanguage}
                    options={LANGUAGES}
                    title={t('home_page.settings.language')}
                    placeholder={LANGUAGES.find((language) => language.value === currentLanguage)?.title}
                />
            </div>
            <span className={styles.subtitle}>{t('home_page.settings.other')}</span>
            <button className={styles['setting-container']}>
                <span>{t('home_page.settings.notifications')}</span>
                <Switch
                    onChange={() => onUpdateNotification()}
                    checked={notificationStatus}
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
            </button>
            <a className={styles['setting-container']}>
                <span>{t('home_page.settings.confidentiality')}</span>
                <img alt="right-arrow" src={ArrowRightSvg} />
            </a>
            <a className={`${styles['setting-container']} large-margin-bottom`}>
                <span>{t('home_page.settings.CGU')}</span>
                <img alt="right-arrow" src={ArrowRightSvg} />
            </a>

            <span className={styles.subtitle}>{t('home_page.settings.account')}</span>
            <button className={styles['setting-container']} onClick={onDeletionAsked}>
                <span>{t('home_page.settings.unsubscribe')}</span>
                <img alt="right-arrow" src={ArrowRightSvg} />
            </button>
            <button className={styles['setting-container']} onClick={onDisconnect}>
                <span>{t('home_page.settings.logout')}</span>
                <img alt="right-arrow" src={ArrowRightSvg} />
            </button>
        </div>
    );
};

export default SettingsContent;
