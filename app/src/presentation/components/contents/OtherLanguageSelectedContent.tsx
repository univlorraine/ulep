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
    return (
        <>
            <div className={otherLanguagesSelectedStyles.content}>
                <h1 className="title">{t('pairing_other_languages_page.selected_language.title')}</h1>
                <p className="subtitle">{t('pairing_other_languages_page.selected_language.subtitle')}</p>

                <p className={otherLanguagesSelectedStyles['language-title']}>
                    {t('pairing_other_languages_page.selected_language.language')}
                </p>
                <div className={otherLanguagesSelectedStyles['language-container']}>{`${codeCountryToFlag(
                    language.code
                )} ${language.name}`}</div>

                <img alt="FAQ" className={otherLanguagesSelectedStyles.image} src="/assets/FAQ.svg" />

                <p className={otherLanguagesSelectedStyles.explaination}>
                    {`${t('pairing_other_languages_page.selected_language.explain_first_start')} ${language.name} ${t(
                        'pairing_other_languages_page.selected_language.explain_first_end'
                    )}`}
                    <br />
                    <br />
                    {t('pairing_other_languages_page.selected_language.explain_second')}
                    <br />
                    <br />
                    {t('pairing_other_languages_page.selected_language.explain_third')}
                </p>
            </div>
            <div className={`large-margin-top extra-large-margin-bottom`}>
                <button className={`primary-button `} onClick={onNextStep}>
                    {t('pairing_other_languages_page.selected_language.validate_button')}
                </button>
            </div>
        </>
    );
};

export default OtherLanguageSelectedContent;
