import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusPng } from '../../../assets';
import Language from '../../../domain/entities/Language';
import University from '../../../domain/entities/University';
import FlagBubble from '../FlagBubble';
import Loader from '../Loader';
import styles from './LearnableLanguagesContent.module.css';

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
                    <div
                        className={styles['languages-container']}
                        role="radiogroup"
                        aria-label={t('pairing_languages_page.title') as string}
                    >
                        {!!languages.length &&
                            languages.map((language) => {
                                const isSelected = selectedLanguage?.code === language.code;
                                return (
                                    <FlagBubble
                                        key={language.code}
                                        isSelected={isSelected}
                                        role="radio"
                                        aria-checked={isSelected}
                                        language={language}
                                        onPressed={setSelectedLanguage}
                                        textColor={isSelected ? 'white' : 'black'}
                                    />
                                );
                            })}
                        {!isLoading && university.isCentral && (
                            <button
                                aria-label={t('pairing_other_languages_page.choosing_another_language') as string}
                                style={{ background: 'none' }}
                                onClick={navigateToOtherLanguages}
                            >
                                <img alt="" className={styles.image} src={PlusPng} aria-hidden={true} />
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
