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
import { useHistory } from 'react-router';

interface SettingsContentProps {
    onBackPressed: () => void;
    onDisconnect: () => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ onBackPressed, onDisconnect }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { askForAccountDeletion, browserAdapter, configuration, updateNotificationPermission } = useConfig();
    const setLanguage = useStoreActions((state) => state.setLanguage);
    const currentLanguage = useStoreState((state) => state.language);
    const setProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [showToast] = useIonToast();
    const profile = useStoreState((state) => state.profile);
    const updateProfile = useStoreActions((state) => state.updateProfile);
    const [emailNotificationStatus, setEmailNotificationStatus] = useState<boolean>(profile!.user.acceptsEmail);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

    const onEditAccount = () => {
        if (!profile) {
            return;
        }

        setProfileSignUp({
            availabilities: profile.availabilities,
            availabilityNote: profile.availabilitiesNote,
            availabilityNotePrivate: profile.availabilitiesNotePrivacy,
            biography: {
                power: profile.biography.superpower,
                place: profile.biography.favoritePlace,
                travel: profile.biography.experience,
                incredible: profile.biography.anecdote,
            },
            frequency: profile.frequency,
            goals: profile.goals,
            nativeLanguage: profile.nativeLanguage,
            otherLanguages: profile.masteredLanguages,
            interests: profile.interests.map((interest) => interest.id),
            firstname: profile.user.firstname,
            lastname: profile.user.lastname,
            gender: profile.user.gender,
            age: profile.user.age,
            email: profile.user.email,
            university: profile.user.university,
        });
        history.push('/edit/informations');
    };

    return (
        <div className={`content-wrapper ${styles.container}`}>
            <button
                aria-label={t('global.go_back') as string}
                className={styles['back-button']}
                onClick={onBackPressed}
            >
                <img alt={t('global.go_back') as string} src={ArrowLeftSvg} />
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
            <button
                aria-label={t('home_page.settings.notifications') as string}
                className={styles['setting-container']}
            >
                <span>{t('home_page.settings.notifications')}</span>
                <Switch
                    onChange={() => onUpdateNotification()}
                    checked={emailNotificationStatus}
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
            </button>
            <a
                href={configuration.confidentialityUrl}
                onClick={browserAdapter.openLinkInBrowser}
                className={styles['setting-container']}
            >
                <span>{t('home_page.settings.confidentiality')}</span>
                <img alt="" src={ArrowRightSvg} />
            </a>
            <a
                href={configuration.cguUrl}
                onClick={browserAdapter.openLinkInBrowser}
                className={`${styles['setting-container']} large-margin-bottom`}
            >
                <span>{t('home_page.settings.CGU')}</span>
                <img alt="" src={ArrowRightSvg} />
            </a>

            <span className={styles.subtitle}>{t('home_page.settings.account')}</span>
            <button
                aria-label={t('home_page.settings.edit_account') as string}
                className={styles['setting-container']}
                onClick={onEditAccount}
            >
                <span>{t('home_page.settings.edit_account')}</span>
                <img alt="" src={ArrowRightSvg} />
            </button>
            <button
                aria-label={t('home_page.settings.unsubscribe') as string}
                className={styles['setting-container']}
                onClick={() => setIsModalOpen(true)}
            >
                <span>{t('home_page.settings.unsubscribe')}</span>
                <img alt="" src={ArrowRightSvg} />
            </button>
            <button
                aria-label={t('home_page.settings.logout') as string}
                className={styles['setting-container']}
                onClick={onDisconnect}
            >
                <span>{t('home_page.settings.logout')}</span>
                <img alt="" src={ArrowRightSvg} />
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
