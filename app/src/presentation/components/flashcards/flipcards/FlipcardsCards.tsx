import styles from './FlipcardsCards.module.css';
import Vocabulary from '../../../../domain/entities/Vocabulary';
import AudioLine from '../../AudioLine';
import { volumeHigh } from 'ionicons/icons';

interface FlipcardsCardsProps {
    currentVocabulary: Vocabulary;
    showAnswer: boolean;
}

const FlipcardsCards: React.FC<FlipcardsCardsProps> = ({
    currentVocabulary,
    showAnswer
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <span className={styles.word}>{currentVocabulary.translation}</span>
                {currentVocabulary.pronunciationTranslationUrl && (
                    <AudioLine audioFile={currentVocabulary.pronunciationTranslationUrl} hideProgressBar small icon={volumeHigh} />
                )}
            </div>
            {showAnswer && (
                <div className={styles.card}>
                    <span className={styles.word}>{currentVocabulary.word}</span>
                    {currentVocabulary.pronunciationWordUrl && (
                        <AudioLine audioFile={currentVocabulary.pronunciationWordUrl} hideProgressBar small icon={volumeHigh}/>
                    )}
                </div>
            )}
        </div>
    );
};

export default FlipcardsCards;
