import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreActions } from '../../../store/storeTypes';
import Dropdown from '../DropDown';
import styles from './SettingsContent.module.css';

interface SettingsContentProps {
    onBackPressed: () => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ onBackPressed }) => {
    const { i18n, t } = useTranslation();
    const { askForAccountDeletion, updateNotificationPermission } = useConfig();
    const [showToast] = useIonToast();
    const logout = useStoreActions((store) => store.logout);
    const [notificationStatus, setNotificationStatus] = useState<boolean>(true);

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

    return (
        <div className={styles.container}>
            <button className={styles['back-button']} onClick={onBackPressed}>
                <img alt="arrow-left" src="/assets/left-arrow.svg" />
            </button>
            <h1 className={styles.title}>{t('home_page.settings.title')}</h1>

            <div className="large-margin-vertical">
                <Dropdown
                    onChange={(value) => i18n.changeLanguage(value)}
                    options={[
                        { title: 'French', value: 'fr' },
                        { title: 'English', value: 'en' },
                        { title: 'Chinese', value: 'cn' },
                    ]}
                    title={t('home_page.settings.language')}
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
                <img alt="right-arrow" src="/assets/arrow-right.svg" />
            </a>
            <a className={`${styles['setting-container']} large-margin-bottom`}>
                <span>{t('home_page.settings.CGU')}</span>
                <img alt="right-arrow" src="/assets/arrow-right.svg" />
            </a>

            <span className={styles.subtitle}>{t('home_page.settings.account')}</span>
            <button className={styles['setting-container']} onClick={onDeletionAsked}>
                <span>{t('home_page.settings.unsubscribe')}</span>
                <img alt="right-arrow" src="/assets/arrow-right.svg" />
            </button>
            <button className={styles['setting-container']} onClick={() => logout()}>
                <span>{t('home_page.settings.logout')}</span>
                <img alt="right-arrow" src="/assets/arrow-right.svg" />
            </button>
        </div>
    );
};

export default SettingsContent;
