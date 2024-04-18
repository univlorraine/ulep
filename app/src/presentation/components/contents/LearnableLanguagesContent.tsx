import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import FlagBubble from '../FlagBubble';
import { PlusPng } from '../../../assets';
import styles from './LearnableLanguagesContent.module.css';
import Loader from '../Loader';
import { useState } from 'react';
import University from '../../../domain/entities/University';

interface LearnableLanguagesContentProps {
    abortStep: () => void;
    languages: Language[];
    isLoading: boolean;
    navigateToOtherLanguages: () => void;
    nextStep: (language: Language) => void;
    university: University;
}

const LearnableLanguagesContent: React.FC<LearnableLanguagesContentProps> = ({
    abortStep,
    languages,
    isLoading,
    navigateToOtherLanguages,
    nextStep,
    university,
}) => {
    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<Language>();

    const sendLanguage = () => {
        if (selectedLanguage) {
            nextStep(selectedLanguage);
        }
    };

    return (
        <div className={styles.content}>
            <h1 className="title">{t('pairing_languages_page.title')}</h1>
            {isLoading ? (
                <div className={styles.loader}>
                    <Loader />
                </div>
            ) : (
                <>
                    <p className="subtitle">
                        {t(
                            languages.length ? 'pairing_languages_page.subtitle' : 'pairing_languages_page.no_languages'
                        )}
                    </p>
                    <div className={styles['languages-container']}>
                        {!!languages.length &&
                            languages.map((language) => {
                                return (
                                    <FlagBubble
                                        key={language.code}
                                        isSelected={selectedLanguage?.code === language.code}
                                        language={language}
                                        onPressed={setSelectedLanguage}
                                    />
                                );
                            })}
                        {!isLoading && university.isCentral && (
                            <button
                                aria-label={t('pairing_other_languages_page.selected_language.title') as string}
                                style={{ background: 'none' }}
                                onClick={navigateToOtherLanguages}
                            >
                                <img alt="" className={styles.image} src={PlusPng} />
                            </button>
                        )}
                    </div>
                    <div className={`extra-large-margin-bottom`}>
                        {!!languages.length && (
                            <button
                                aria-label={t('pairing_languages_page.validate_button') as string}
                                className={`primary-button ${!selectedLanguage ? 'disabled' : ''}`}
                                disabled={!selectedLanguage}
                                onClick={sendLanguage}
                            >
                                {t('pairing_languages_page.validate_button')}
                            </button>
                        )}
                        {!languages.length && (
                            <button
                                aria-label={t('pairing_languages_page.home_button') as string}
                                className={`primary-button`}
                                onClick={abortStep}
                            >
                                {t('pairing_languages_page.home_button')}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default LearnableLanguagesContent;
