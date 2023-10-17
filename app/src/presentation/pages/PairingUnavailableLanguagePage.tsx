import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import LanguageSelectedContent from '../components/contents/LanguageSelectedContent';
import SuccessLayout from '../components/layout/SuccessLayout';
import styles from './css/PairingUnavailableLanguage.module.css';
import { AvatarPlaceholderPng } from '../../assets';

interface PairingUnavailableLanguageState {
    askingStudents: number;
}

const PairingUnavailableLanguagePage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();
    const location = useLocation<PairingUnavailableLanguageState>();
    const { askingStudents } = location.state || {};
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const language = profileSignUp.learningLanguage;
    const [isLastStep, setIsLastStep] = useState<boolean>(false);
    const profile = useStoreState((state) => state.profile);
    const user = profile?.user;

    if (!language || !user) {
        return <Redirect to={`/pairing/languages`} />;
    }

    return (
        <SuccessLayout
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            backgroundColorCode={configuration.secondaryDarkColor}
            colorCode={configuration.secondaryColor}
        >
            <div className={styles.container}>
                {askingStudents > 0 && !isLastStep && (
                    <LanguageSelectedContent
                        language={language}
                        mode="unavailable"
                        profilePicture={user.avatar ?? AvatarPlaceholderPng}
                        onNextPressed={() => setIsLastStep(true)}
                    />
                )}
                {(askingStudents === 0 || isLastStep) && (
                    <>
                        <FlagBubble language={language} textColor="white" isSelected disabled />
                        <span className="title">{`${t('pairing_unavailable_language_page.title')}`}</span>
                        <p className={styles.description}>{t('pairing_unavailable_language_page.subtitle')}</p>
                        <span className={styles.description}>{t('pairing_unavailable_language_page.luck')}</span>
                        <div className={styles['bottom-container']}>
                            <p className={styles['button-title']}>
                                {t('pairing_unavailable_language_page.next_title')}
                            </p>
                            <div className={styles['button-container']}>
                                <button className="primary-button" onClick={() => history.push('/pairing/languages')}>
                                    {t('pairing_unavailable_language_page.next_button')}
                                </button>
                            </div>
                        </div>
                        <div className={styles['bottom-container']}>
                            <p className={styles['button-title']}>
                                {t('pairing_unavailable_language_page.pedagogy_title')}
                            </p>
                            <div className={styles['button-container']}>
                                <button className="primary-button" onClick={() => history.replace('/pairing/pedagogy')}>
                                    {t('pairing_unavailable_language_page.pedagogy_button')}
                                </button>
                            </div>
                        </div>
                        <div className={styles['bottom-container']}>
                            <p className={styles['button-title']}>
                                {t('pairing_unavailable_language_page.ressource_title')}
                            </p>
                            <div className={styles['button-container']}>
                                <a href={configuration.ressourceUrl} className="primary-button">
                                    {t('pairing_unavailable_language_page.ressource_button')}
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </SuccessLayout>
    );
};

export default PairingUnavailableLanguagePage;
