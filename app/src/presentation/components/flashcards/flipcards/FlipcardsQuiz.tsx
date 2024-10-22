import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Vocabulary from '../../../../domain/entities/Vocabulary';
import Loader from '../../Loader';
import FlipcardsButtons from './FlipcardsButtons';
import FlipcardsCards from './FlipcardsCards';
import styles from './FlipcardsQuiz.module.css';

interface FlipcardsQuizProps {
    isLoading: boolean;
    vocabularies: Vocabulary[];
    setNumberRightAnswers: (count: number) => void;
    numberRightAnswers: number;
    setIsQuizFinished: (boolean: boolean) => void;
}

const FlipcardsQuiz: React.FC<FlipcardsQuizProps> = ({
    isLoading,
    vocabularies,
    setNumberRightAnswers,
    numberRightAnswers,
    setIsQuizFinished,
}) => {
    const [vocabulariesCount, setVocabulariesCount] = useState<number>(1);
    const [currentVocabulary, setCurrentVocabulary] = useState<Vocabulary>({
        id: '',
        word: '',
        translation: '',
        pronunciationTranslationUrl: '',
        pronunciationWordUrl: '',
    });
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    const { t } = useTranslation();

    useEffect(() => {
        if (vocabularies.length > 0 && !currentVocabulary.word && !isLoading) {
            setCurrentVocabulary(vocabularies[0]);
        }
    }, [isLoading]);

    return (
        <div className={`${styles.container} content-wrapper`}>
            <div className={styles.progressBar}>
                <p className={styles.title}>{t('flashcards.flipcards.title')}</p>
                <p className={styles.text}>
                    {t('flashcards.flipcards.term.term')} {vocabulariesCount} {t('flashcards.flipcards.term.of')}{' '}
                    {vocabularies.length}
                </p>
            </div>

            {isLoading && <Loader />}
            {!isLoading && <FlipcardsCards currentVocabulary={currentVocabulary} showAnswer={showAnswer} />}

            <FlipcardsButtons
                vocabularies={vocabularies}
                setCurrentVocabulary={setCurrentVocabulary}
                setVocabulariesCount={setVocabulariesCount}
                vocabulariesCount={vocabulariesCount}
                setNumberRightAnswers={setNumberRightAnswers}
                numberRightAnswers={numberRightAnswers}
                setShowAnswer={setShowAnswer}
                showAnswer={showAnswer}
                setIsQuizFinished={setIsQuizFinished}
            />
        </div>
    );
};

export default FlipcardsQuiz;
