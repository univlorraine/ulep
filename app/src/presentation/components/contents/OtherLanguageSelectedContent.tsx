import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import { codeCountryToFlag } from '../../utils';
import otherLanguagesSelectedStyles from './OtherLanguageSelectedContent.module.css';

interface OtherLanguageSelectedContentProps {
    language: Language;
    onNextStep: () => void;
}

const OtherLanguageSelectedContent: React.FC<OtherLanguageSelectedContentProps> = ({ language, onNextStep }) => {
    const { t } = useTranslation();
    const [selectedLaguage, setSelectedLanguage] = useState<Language>();

    const nextStep = () => {
        if (!selectedLaguage) {
            return null;
        }
        //TODO: Ask for add language ( and get number of call )
        return onNextStep();
    };
    return (
        <>
            <div className={otherLanguagesSelectedStyles.content}>
                <h1 className={otherLanguagesSelectedStyles.title}>
                    {t('signup_pairing_other_languages_page.selected_language.title')}
                </h1>
                <p className={otherLanguagesSelectedStyles.subtitle}>
                    {t('signup_pairing_other_languages_page.selected_language.subtitle')}
                </p>

                <p className={otherLanguagesSelectedStyles['language-title']}>
                    {' '}
                    {t('signup_pairing_other_languages_page.selected_language.language')}
                </p>
                <div className={otherLanguagesSelectedStyles['language-container']}>{`${codeCountryToFlag(
                    language.code
                )} ${language.name}`}</div>

                <img alt="FAQ" className={otherLanguagesSelectedStyles.image} src="/assets/FAQ.svg" />

                <p className={otherLanguagesSelectedStyles.explaination}>
                    {t('signup_pairing_other_languages_page.selected_language.explain_first')} <br />
                    <br />
                    {t('signup_pairing_other_languages_page.selected_language.explain_second')} <br />
                    <br />
                    {t('signup_pairing_other_languages_page.selected_language.explain_third')}
                </p>
            </div>
            <div className={`${otherLanguagesSelectedStyles['bottom-container']} large-margin-top large-margin-bottom`}>
                <button className={`primary-button `} onClick={nextStep}>
                    {t('signup_pairing_other_languages_page.selected_language.validate_button')}
                </button>
            </div>
        </>
    );
};

export default OtherLanguageSelectedContent;
