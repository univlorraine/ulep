import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DicePng } from '../../../assets';
import Language from '../../../domain/entities/Language';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import Checkbox from '../Checkbox';
import pairingOtherLanguagesStyles from './OtherLanguageContent.module.css';

interface OtherLanguageContentProps {
    displayJoker: boolean;
    languages: Language[];
    onLanguageSelected: (language: Language) => void;
}

const OtherLanguageContent: React.FC<OtherLanguageContentProps> = ({ displayJoker, languages, onLanguageSelected }) => {
    const { t } = useTranslation();
    const [selectedLaguage, setSelectedLanguage] = useState<Language>();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    const nextStep = () => {
        if (!selectedLaguage) {
            return null;
        }

        return onLanguageSelected(selectedLaguage);
    };
    return (
        <>
            <div className={pairingOtherLanguagesStyles.content}>
                <h1 className="title">{t('pairing_other_languages_page.title')}</h1>
                <p className="subtitle">{t('pairing_other_languages_page.subtitle')}</p>

                <div className={pairingOtherLanguagesStyles['joker-container']}>
                    <div className={pairingOtherLanguagesStyles['joker-image-container']}>
                        <img alt="" className={pairingOtherLanguagesStyles.dice} src={DicePng} aria-hidden={true} />
                        <div className={pairingOtherLanguagesStyles['joker-text-container']}>
                            <p className={pairingOtherLanguagesStyles['joker-description']}>
                                {t('pairing_other_languages_page.joker_description')}
                            </p>
                            {displayJoker && !isHybrid && (
                                <Checkbox
                                    isSelected={selectedLaguage?.code === '*'}
                                    onPressed={() => setSelectedLanguage(new Language('joker', '*', 'Joker'))}
                                    name={t('pairing_other_languages_page.joker_checkbox')}
                                    textClass={pairingOtherLanguagesStyles['checkbox-text']}
                                />
                            )}
                        </div>
                    </div>
                    {displayJoker && isHybrid && (
                        <Checkbox
                            isSelected={selectedLaguage?.code === '*'}
                            onPressed={() => setSelectedLanguage(new Language('joker', '*', 'Joker'))}
                            name={t('pairing_other_languages_page.joker_checkbox')}
                            textClass={pairingOtherLanguagesStyles['checkbox-text']}
                        />
                    )}
                </div>

                <div className={pairingOtherLanguagesStyles['other-checkbox-container']}>
                    {languages.map((language) => {
                        return (
                            <div key={language.code} style={{ marginBottom: 20 }}>
                                <Checkbox
                                    isSelected={language.code === selectedLaguage?.code}
                                    onPressed={() => setSelectedLanguage(language)}
                                    name={t(`languages_code.${language.code}`)}
                                    textClass={pairingOtherLanguagesStyles['checkbox-text']}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={`large-margin-top extra-large-margin-bottom`}>
                <button
                    aria-label={t('pairing_other_languages_page.validate_button') as string}
                    className={`primary-button ${!selectedLaguage ? 'disabled' : ''}`}
                    disabled={!selectedLaguage}
                    onClick={nextStep}
                >
                    {t('pairing_other_languages_page.validate_button')}
                </button>
            </div>
        </>
    );
};

export default OtherLanguageContent;
