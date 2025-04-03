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
import { QuizzPng } from '../../../assets';
import Question from '../../../domain/entities/Question';
import styles from './QuizzContent.module.css';

interface QuizzContentProps {
    onQuizzOver: (percentage: number) => void;
    questions: Question[];
    quizzLevel: string;
}

const QuizzContent: React.FC<QuizzContentProps> = ({ onQuizzOver, questions, quizzLevel }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<boolean[]>(new Array(questions.length).fill(false));
    const { t } = useTranslation();

    const answer = (answer: boolean) => {
        const currentAnswers = [...answers];
        currentAnswers[currentIndex] = answer === questions[currentIndex].answer;
        setAnswers(currentAnswers);

        if (currentIndex === questions.length - 1) {
            const correctAnswersCount = currentAnswers.filter((value) => value === true).length;
            return onQuizzOver((correctAnswersCount / currentAnswers.length) * 100);
        }

        return setCurrentIndex(currentIndex + 1);
    };

    return (
        <>
            <div>
                <h1 className="title">{t('pairing_quizz_page.title')}</h1>
                <p className="subtitle">{t('pairing_quizz_page.subtitle')}</p>

                <div className={styles['question-container']}>
                    <p className={styles['question-title']}>{t('global.question')}</p>
                    <span className={styles['count-question']}>
                        <span className={styles['current-question']}>{currentIndex + 1}</span>
                        {`/${questions.length}`}
                    </span>
                    <div className={styles['level-container']}>
                        <img alt="" src={QuizzPng} aria-hidden={true} />
                        {quizzLevel}
                    </div>
                    <span className={styles['question-title']}>{questions[currentIndex].question}</span>
                </div>
            </div>
            <div className={`${styles['button-container']} extra-large-margin-bottom`}>
                <button aria-label={t('global.yes') as string} className="primary-button" onClick={() => answer(true)}>
                    {t('global.yes')}
                </button>
                <button aria-label={t('global.no') as string} className="primary-button" onClick={() => answer(false)}>
                    {t('global.no')}
                </button>
            </div>
        </>
    );
};

export default QuizzContent;
