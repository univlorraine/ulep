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
import Language from '../../../domain/entities/Language';
import FlagBubble from '../FlagBubble';
import styles from './LanguageSelectedContent.module.css';
import Avatar from '../Avatar';
import User from '../../../domain/entities/User';

interface LanguageSelectedContentProps {
    language: Language;
    mode: 'confirm' | 'unavailable';
    user: User;
    onNextPressed: () => void;
}

const LanguageSelectedContent: React.FC<LanguageSelectedContentProps> = ({ language, mode, user, onNextPressed }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h1 className="title">{`${t(`pairing_${mode}_language_page.not_alone.title`)}`}</h1>
            <span className="subtitle">{`${t(`pairing_${mode}_language_page.not_alone.subtitle`)}`}</span>
            <div className={styles['image-container']}>
                <Avatar user={user} className={styles.image} />
                <div className={styles.bubble}>
                    <FlagBubble language={language} textColor="white" isSelected disabled />
                </div>
            </div>
            <div className={styles['button-container']}>
                {mode === 'confirm' && (
                    <h1 className={styles['description-title']}>
                        {t(`pairing_${mode}_language_page.not_alone.description_title`)}
                    </h1>
                )}
                {language.code !== '*' && (
                    <p className={styles.description}>{t(`pairing_${mode}_language_page.not_alone.description`)}</p>
                )}
                {mode === 'confirm' && language.code === '*' && (
                    <p className={styles.description}>
                        {t(`pairing_${mode}_language_page.not_alone.description_joker`)}
                    </p>
                )}
                <button
                    aria-label={t(`pairing_${mode}_language_page.not_alone.validate_button`) as string}
                    className={'primary-button large-margin-top'}
                    onClick={onNextPressed}
                >
                    {t(`pairing_${mode}_language_page.not_alone.validate_button`)}
                </button>
            </div>
        </div>
    );
};

export default LanguageSelectedContent;
