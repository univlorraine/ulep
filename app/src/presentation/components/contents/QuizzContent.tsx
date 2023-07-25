import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import Question from '../../../domain/entities/Question';
import styles from './QuizzContent.module.css';

interface QuizzContentProps {
    questions: Question[];
    quizzLevel: string;
}

const QuizzContent: React.FC<QuizzContentProps> = ({ questions, quizzLevel }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const { configuration } = useConfig();
    const { t } = useTranslation();

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
                <button className="primary-button large-margin-bottom" onClick={() => undefined}>
                    {t('global.yes')}
                </button>
                <button className="primary-button large-margin-bottom" onClick={() => undefined}>
                    {t('global.no')}
                </button>
            </div>
        </>
    );
};

export default QuizzContent;
