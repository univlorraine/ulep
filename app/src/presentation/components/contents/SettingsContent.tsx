import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import { ArrowLeftSvg, ArrowRightSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../../store/storeTypes';
import Dropdown from '../DropDown';
import styles from './SettingsContent.module.css';
import ConfirmModal from '../modals/ConfirmModal';
import { Browser } from '@capacitor/browser';

interface SettingsContentProps {
    onBackPressed: () => void;
    onDisconnect: () => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ onBackPressed, onDisconnect }) => {
    const { t } = useTranslation();
    const { askForAccountDeletion, configuration, updateNotificationPermission } = useConfig();
    const setLanguage = useStoreActions((state) => state.setLanguage);
    const currentLanguage = useStoreState((state) => state.language);
    const [showToast] = useIonToast();
    const profile = useStoreState((state) => state.profile);
    const updateProfile = useStoreActions((state) => state.updateProfile);
    const [emailNotificationStatus, setEmailNotificationStatus] = useState<boolean>(profile!.user.acceptsEmail);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openBrowser = (url: string) => async () => {
        await Browser.open({ url });
    };

    const LANGUAGES = [
        { label: t('languages.french'), value: 'fr' },
        { label: t('languages.english'), value: 'en' },
        { label: t('languages.chinese'), value: 'zh' },
        { label: t('languages.deutsche'), value: 'de' },
        { label: t('languages.spanish'), value: 'es' },
    ];

    const onDeletionAsked = async () => {
        const result = await askForAccountDeletion.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }
        setIsModalOpen(false);
        return await showToast({ message: t('home_page.settings.deletion'), duration: 1000 });
    };

    const onUpdateNotification = async () => {
        const result = await updateNotificationPermission.execute(profile!.user.id, !emailNotificationStatus);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        } else {
            setEmailNotificationStatus(!emailNotificationStatus);
            return updateProfile({ acceptsEmail: result.acceptsEmail });
        }
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
                    placeholder={LANGUAGES.find((language) => language.value === currentLanguage)?.label}
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
            <a onClick={openBrowser(configuration.confidentialityUrl)} className={styles['setting-container']}>
                <span>{t('home_page.settings.confidentiality')}</span>
                <img alt="right-arrow" src={ArrowRightSvg} />
            </a>
            <a
                onClick={openBrowser(configuration.cguUrl)}
                className={`${styles['setting-container']} large-margin-bottom`}
            >
                <span>{t('home_page.settings.CGU')}</span>
                <img alt="right-arrow" src={ArrowRightSvg} />
            </a>

            <span className={styles.subtitle}>{t('home_page.settings.account')}</span>
            <button className={styles['setting-container']} onClick={() => setIsModalOpen(true)}>
                <span>{t('home_page.settings.unsubscribe')}</span>
                <img alt="right-arrow" src={ArrowRightSvg} />
            </button>
            <button className={styles['setting-container']} onClick={onDisconnect}>
                <span>{t('home_page.settings.logout')}</span>
                <img alt="right-arrow" src={ArrowRightSvg} />
            </button>
            <ConfirmModal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onValidate={() => onDeletionAsked()}
                title={t('confirm_modal.title')}
            />
        </div>
    );
};

export default SettingsContent;
