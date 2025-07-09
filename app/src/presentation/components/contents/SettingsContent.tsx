/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Switch from 'react-switch';
import { ArrowLeftSvg, ArrowRightSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../../store/storeTypes';
import Dropdown from '../DropDown';
import ConfirmModal from '../modals/ConfirmModal';
import styles from './SettingsContent.module.css';

interface SettingsContentProps {
    onLanguageChange?: () => void;
    onBackPressed: () => void;
    onDisconnect: () => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ onBackPressed, onDisconnect, onLanguageChange }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { askForAccountDeletion, browserAdapter, configuration, updateNotificationPermission } = useConfig();
    const setLanguage = useStoreActions((state) => state.setLanguage);
    const setRtl = useStoreActions((state) => state.setRtl);
    const { language: currentLanguage, isRtl, profile, accessToken } = useStoreState((state) => state);
    const setProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [showToast] = useIonToast();
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

    const onUpdateRtl = async () => {
        setRtl({ isRtl: !currentLanguage });
    };

    const updateLanguage = (code: string) => {
        setLanguage({ language: code });
        onLanguageChange?.();
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
            <button aria-label={t('home_page.settings.rtl') as string} className={styles['setting-container']}>
                <span>{t('home_page.settings.rtl_button')}</span>
                <Switch
                    onChange={() => onUpdateRtl()}
                    checked={Boolean(isRtl)}
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
            </button>

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
                target="_blank"
                rel="noopener noreferrer"
                onClick={browserAdapter.openLinkInBrowser}
                className={styles['setting-container']}
            >
                <span onClick={(e) => e.stopPropagation()}>{t('home_page.settings.confidentiality')}</span>
                <img onClick={(e) => e.stopPropagation()} alt="" src={ArrowRightSvg} />
            </a>
            <a
                href={configuration.cguUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={browserAdapter.openLinkInBrowser}
                className={`${styles['setting-container']} large-margin-bottom`}
            >
                <span onClick={(e) => e.stopPropagation()}>{t('home_page.settings.CGU')}</span>
                <img onClick={(e) => e.stopPropagation()} alt="" src={ArrowRightSvg} />
            </a>

            <span className={styles.subtitle}>{t('home_page.settings.account')}</span>
            <button
                aria-label={t('home_page.settings.edit_account') as string}
                className={styles['setting-container']}
                onClick={onEditAccount}
            >
                <span>{t('home_page.settings.edit_account')}</span>
                <img alt="" src={ArrowRightSvg} aria-hidden={true} />
            </button>
            <button
                aria-label={t('home_page.settings.unsubscribe') as string}
                className={styles['setting-container']}
                onClick={() => setIsModalOpen(true)}
            >
                <span>{t('home_page.settings.unsubscribe')}</span>
                <img alt="" src={ArrowRightSvg} aria-hidden={true} />
            </button>
            <button
                aria-label={t('home_page.settings.logout') as string}
                className={styles['setting-container']}
                onClick={onDisconnect}
            >
                <span>{t('home_page.settings.logout')}</span>
                <img alt="" src={ArrowRightSvg} aria-hidden={true} />
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
