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
    const { i18n, t } = useTranslation();
    const { askForAccountDeletion, updateNotificationPermission } = useConfig();
    const [showToast] = useIonToast();
    const profile = useStoreState((state) => state.profile);
    const updateProfile = useStoreActions((state) => state.updateProfile);
    const [emailNotificationStatus, setEmailNotificationStatus] = useState<boolean>(profile!.user.acceptsEmail);

    const onDeletionAsked = async () => {
        const result = await askForAccountDeletion.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }
        return await showToast({ message: t('home_page.settings.deletion'), duration: 1000 });
    };

    const onUpdateNotification = async () => {
        const result = await updateNotificationPermission.execute(profile!.user.id, !emailNotificationStatus);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        setEmailNotificationStatus(!emailNotificationStatus);
        return updateProfile({ acceptsEmail: !profile!.user.acceptsEmail });
    };

    return (
        <div className={styles.container}>
            <button className={styles['back-button']} onClick={onBackPressed}>
                <img alt="arrow-left" src={ArrowLeftSvg} />
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
                    checked={emailNotificationStatus}
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
