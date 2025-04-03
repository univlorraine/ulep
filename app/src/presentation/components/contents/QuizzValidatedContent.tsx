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
import Lottie from 'react-lottie';
import { QuizzPng, TrophiePng } from '../../../assets';
import confetti from '../../../assets/animations/confetti.json';
import Language from '../../../domain/entities/Language';
import FlagBubble from '../FlagBubble';
import styles from './QuizzValidatedContent.module.css';

interface QuizzValidatedContentProps {
    language: Language;
    onNextQuizz?: () => void;
    onNextStep?: () => void;
    quizzLevel: string;
    newLevel?: number;
    isNewLanguage?: boolean;
}

const QuizzValidatedContent: React.FC<QuizzValidatedContentProps> = ({
    language,
    onNextQuizz,
    onNextStep,
    quizzLevel,
    newLevel,
    isNewLanguage,
}) => {
    const { t } = useTranslation();

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: confetti,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div className={styles.container}>
            <h1 className="title">{`${t(`pairing_quizz_validation.title`)}`}</h1>
            {newLevel === undefined && onNextStep && (
                <p className="subtitle">{t(`pairing_quizz_validation.subtitle`)}</p>
            )}
            <div className={styles['image-container']}>
                <img className={styles.image} alt="" src={TrophiePng} />
                <div className={styles.bubble}>
                    <FlagBubble language={language} textColor="white" isSelected disabled />
                </div>
                {!isNewLanguage && !!newLevel && (
                    <div className={styles['bubble-cefr']}>{`${newLevel >= 1 ? '+' : ''}${newLevel}`}</div>
                )}
            </div>
            <div className={styles['level-container']}>
                <img alt="" src={QuizzPng} aria-hidden={true} />
                {`${quizzLevel} ${t('pairing_quizz_validation.validated')}`}
            </div>
            <p className={styles.description}>
                {onNextStep
                    ? t(`pairing_quizz_validation.description_next_step.${quizzLevel}`)
                    : t('pairing_quizz_validation.description')}
            </p>
            {onNextQuizz && (
                <button
                    aria-label={t('pairing_quizz_validation.next_button') as string}
                    className="secondary-button"
                    onClick={onNextQuizz}
                >
                    {t('pairing_quizz_validation.next_button')}
                </button>
            )}
            {onNextStep && (
                <button
                    aria-label={t('pairing_quizz_validation.next_step_button') as string}
                    className={`primary-button ${styles.button}`}
                    onClick={onNextStep}
                >
                    {t('pairing_quizz_validation.next_step_button')}
                </button>
            )}
            {!!newLevel && newLevel > 0 && (
                <div className={styles.animation}>
                    <Lottie options={defaultOptions} height="100%" width="100%" />
                </div>
            )}
        </div>
    );
};

export default QuizzValidatedContent;
