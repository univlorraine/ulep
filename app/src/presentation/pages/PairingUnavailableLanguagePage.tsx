import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import SuccessLayout from '../components/SuccessLayout';
import styles from './css/PairingUnavailableLanguage.module.css';

interface PairingUnavailableLanguageState {
    askingStudents: number;
    codeLanguage: string;
    nameLanguage: string;
    enabledLanguage: boolean;
}

const PairingUnavailableLanguagePage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();
    const [isLastStep, setIsLastStep] = useState<boolean>(false);
    const location = useLocation<PairingUnavailableLanguageState>();
    const { askingStudents, codeLanguage, nameLanguage, enabledLanguage } = location.state || {};
    const profileSignUp = useStoreState((payload) => payload.profileSignUp);

    if (!codeLanguage || !nameLanguage) {
        return <Redirect to="/signup/pairing/languages" />;
    }

    const language = new Language(codeLanguage, nameLanguage, enabledLanguage);

    return (
        <SuccessLayout
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            backgroundColorCode={configuration.secondaryDarkColor}
            colorCode={configuration.secondaryColor}
        >
            <div className={styles.container}>
                {askingStudents && !isLastStep && (
                    <>
                        <h1 className={styles.title}>{`${t('pairing_unavailable_language_page.not_alone.title')}`}</h1>
                        <span className={styles.subtitle}>{`${t(
                            'pairing_unavailable_language_page.not_alone.subtitle'
                        )} ${language.name}`}</span>
                        <div className={styles['image-container']}>
                            <img className={styles.image} alt="avatar" src={profileSignUp.profilePicture}></img>
                            <div className={styles.bubble}>
                                <FlagBubble language={language} textColor="white" isSelected disabled />
                            </div>
                        </div>
                        <div className={styles['button-container']}>
                            <p className={styles.description}>
                                {t('pairing_unavailable_language_page.not_alone.description')}
                            </p>
                            <button className={'primary-button large-margin-top'} onClick={() => setIsLastStep(true)}>
                                {t('pairing_unavailable_language_page.not_alone.validate_button')}
                            </button>
                        </div>
                    </>
                )}
                {!askingStudents ||
                    (isLastStep && (
                        <>
                            <FlagBubble language={language} textColor="white" isSelected disabled />
                            <span className={styles.title}>{`${t('pairing_unavailable_language_page.title')}`}</span>
                            <p className={styles.description}>{t('pairing_unavailable_language_page.subtitle')}</p>
                            <span className={styles.description}>{t('pairing_unavailable_language_page.luck')}</span>
                            <div className={styles['bottom-container']}>
                                <p className={styles['button-title']}>
                                    {t('pairing_unavailable_language_page.next_title')}
                                </p>
                                <div className={styles['button-container']}>
                                    <button
                                        className="primary-button"
                                        onClick={() => history.push('/signup/pairing/languages')}
                                    >
                                        {t('pairing_unavailable_language_page.next_button')}
                                    </button>
                                </div>
                            </div>
                            <div className={styles['bottom-container']}>
                                <p className={styles['button-title']}>
                                    {t('pairing_unavailable_language_page.ressource_title')}
                                </p>
                                <div className={styles['button-container']}>
                                    <button className="primary-button">
                                        {t('pairing_unavailable_language_page.ressource_button')}
                                    </button>
                                </div>
                            </div>
                        </>
                    ))}
            </div>
        </SuccessLayout>
    );
};

export default PairingUnavailableLanguagePage;
