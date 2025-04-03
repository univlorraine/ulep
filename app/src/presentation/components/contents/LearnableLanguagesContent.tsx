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
                        <p style={{ textAlign: 'center' }}>{t('pairing_languages_page.required_mention')}</p>
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
