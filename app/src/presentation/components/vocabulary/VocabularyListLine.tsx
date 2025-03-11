import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import styles from './VocabularyListLine.module.css';

interface VocabularyListLineProps {
    onSelectVocabularyList: (vocabularyList: VocabularyList) => void;
    profile: Profile;
    vocabularyList: VocabularyList;
    isEditable?: boolean;
}

const VocabularyListLine: React.FC<VocabularyListLineProps> = ({
    vocabularyList,
    onSelectVocabularyList,
    profile,
    isEditable,
}) => {
    const { t } = useTranslation();

    const isCreatorMe = profile.id === vocabularyList.creatorId;
    const creatorName = isCreatorMe ? t('vocabulary.list.me') : vocabularyList.creatorName;
    const numberOfMissingPronunciation = isCreatorMe
        ? vocabularyList.missingPronunciationOfTranslations
        : vocabularyList.missingPronunciationOfWords;

    return (
        <IonButton
            aria-label={`${vocabularyList.symbol} ${vocabularyList.name}`}
            key={vocabularyList.id}
            fill="clear"
            className={styles.container}
            onClick={() => onSelectVocabularyList(vocabularyList)}
        >
            <div className={styles.content}>
                <span className={styles.title}>{`${vocabularyList.symbol} ${vocabularyList.name}`}</span>
                <span className={styles.creator}>{`${t('vocabulary.list.creator', {
                    name: creatorName,
                })} | ${t('vocabulary.list.number_of_vocabularies', {
                    count: vocabularyList.numberOfVocabularies,
                })}`}</span>

                {numberOfMissingPronunciation > 0 && isEditable && (
                    <span className={styles.pronunciation}>{`${t('vocabulary.list.missing_pronunciation', {
                        count: numberOfMissingPronunciation,
                    })}`}</span>
                )}
                <IonIcon name="arrow-forward" />
            </div>
        </IonButton>
    );
};

export default VocabularyListLine;
