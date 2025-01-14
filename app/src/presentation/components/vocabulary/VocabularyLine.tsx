import { IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import Vocabulary from '../../../domain/entities/Vocabulary';
import AudioLine from '../AudioLine';
import styles from './VocabularyLine.module.css';

interface VocabularyLineProps {
    vocabulary: Vocabulary;
    onVocabularyClick: (vocabulary: Vocabulary) => void;
}

const VocabularyLine: React.FC<VocabularyLineProps> = ({ vocabulary, onVocabularyClick }) => {
    const { t } = useTranslation();
    return (
        <button
            aria-label={t('vocabulary.pair.aria-pressed') as string}
            className={styles.container}
            onClick={() => onVocabularyClick(vocabulary)}
        >
            <div className={styles.content}>
                <div className={styles.player}>
                    <span className={styles.word}>{vocabulary.word}</span>
                    {vocabulary.pronunciationWordUrl && (
                        <AudioLine audioFile={vocabulary.pronunciationWordUrl} hideProgressBar small />
                    )}
                </div>
                <div className={styles.player}>
                    <span className={styles.translation}>
                        {vocabulary.translation ?? t('vocabulary.pair.no_translation')}
                    </span>
                    {vocabulary.pronunciationTranslationUrl && (
                        <AudioLine audioFile={vocabulary.pronunciationTranslationUrl} hideProgressBar small />
                    )}
                </div>
            </div>

            <IonIcon icon={chevronForwardOutline} aria-hidden="true" />
        </button>
    );
};

export default VocabularyLine;
