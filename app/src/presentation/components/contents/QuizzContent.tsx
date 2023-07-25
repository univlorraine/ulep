import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
        currentAnswers[currentIndex] = answer === questions[currentIndex].answser;
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
                        <img alt="quizz" src="/assets/quizz.svg" />
                        {quizzLevel}
                    </div>
                    <span className={styles['question-title']}>{questions[currentIndex].question}</span>
                </div>
            </div>
            <div className={styles['button-container']}>
                <button className="primary-button large-margin-bottom" onClick={() => answer(true)}>
                    {t('global.yes')}
                </button>
                <button className="primary-button large-margin-bottom" onClick={() => answer(false)}>
                    {t('global.no')}
                </button>
            </div>
        </>
    );
};

export default QuizzContent;
