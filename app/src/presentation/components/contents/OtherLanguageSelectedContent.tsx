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

import { useTranslation } from 'react-i18next';
import { FAQPng } from '../../../assets';
import Language from '../../../domain/entities/Language';
import { codeLanguageToFlag } from '../../utils';
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
                <div className={otherLanguagesSelectedStyles['language-container']}>{`${codeLanguageToFlag(
                    language.code
                )} ${t(`languages_code.${language.code}`)}`}</div>

                <img alt="FAQ" className={otherLanguagesSelectedStyles.image} src={FAQPng} />

                <p className={otherLanguagesSelectedStyles.explaination}>
                    {`${t('pairing_other_languages_page.selected_language.explain_first_start')} ${t(
                        `languages_code.${language.code}`
                    )} ${t('pairing_other_languages_page.selected_language.explain_first_end')}`}
                    <br />
                    <br />
                    {t('pairing_other_languages_page.selected_language.explain_second')}
                    <br />
                    <br />
                    {t('pairing_other_languages_page.selected_language.explain_third')}
                </p>
            </div>
            <div className={`large-margin-top extra-large-margin-bottom`}>
                <button
                    aria-label={t('pairing_other_languages_page.selected_language.validate_button') as string}
                    className={`primary-button `}
                    onClick={onNextStep}
                >
                    {t('pairing_other_languages_page.selected_language.validate_button')}
                </button>
            </div>
        </>
    );
};

export default OtherLanguageSelectedContent;
