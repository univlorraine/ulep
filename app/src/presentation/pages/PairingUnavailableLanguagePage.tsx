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

interface PairingUnavailableLanguageState {
    askingStudents: number;
    codeLanguage: string;
    idLanguage: string;
    nameLanguage: string;
    enabledLanguage: boolean;
}

const PairingUnavailableLanguagePage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();
    const [isLastStep, setIsLastStep] = useState<boolean>(false);
    const location = useLocation<PairingUnavailableLanguageState>();
    const { askingStudents, idLanguage, codeLanguage, nameLanguage } = location.state || {};
    const user = useStoreState((state) => state.user);

    if (!codeLanguage || !nameLanguage || !user) {
        return <Redirect to="/signup/pairing/languages" />;
    }

    const language = new Language(idLanguage, codeLanguage, nameLanguage);

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
                        mode={'unavailable'}
                        profilePicture={user.avatar}
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
                )}
            </div>
        </SuccessLayout>
    );
};

export default PairingUnavailableLanguagePage;
