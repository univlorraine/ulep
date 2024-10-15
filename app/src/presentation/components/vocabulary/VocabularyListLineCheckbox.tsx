import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import Checkbox from '../Checkbox';
import styles from './VocabularyListLineCheckbox.module.css';

interface VocabularyListLineProps {
    onSelectVocabularyList: (vocabularyList: VocabularyList) => void;
    profile: Profile;
    vocabularyList: VocabularyList;
    isSelected: boolean;
}

const VocabularyListLineCheckbox: React.FC<VocabularyListLineProps> = ({
    vocabularyList,
    onSelectVocabularyList,
    profile,
    isSelected,
}) => {
    const { t } = useTranslation();

    const isCreatorMe = profile.id === vocabularyList.creatorId;
    const creatorName = isCreatorMe ? t('vocabulary.list.me') : vocabularyList.creatorName;
    const numberOfMissingPronunciation = isCreatorMe
        ? vocabularyList.missingPronunciationOfWords
        : vocabularyList.missingPronunciationOfTranslations;

    return (
        <IonButton
            aria-label={`${vocabularyList.symbol} ${vocabularyList.name}`}
            fill="clear"
            className={styles.container}
            key={vocabularyList.id}
            onClick={() => onSelectVocabularyList(vocabularyList)}
        >
            <div className={styles.content}>
                <span className={styles.title}>{`${vocabularyList.symbol} ${vocabularyList.name}`}</span>
                <span className={styles.creator}>
                    {`${t('vocabulary.list.creator', { name: creatorName })} 
                    | ${t('vocabulary.list.number_of_vocabularies', { count: vocabularyList.numberOfVocabularies })}`}
                </span>

                <span className={styles.pronunciation}>
                    {`${t('vocabulary.list.missing_pronunciation', { count: numberOfMissingPronunciation })}`}
                </span>
                <IonIcon name="arrow-forward" aria-hidden="true" />
            </div>
            <div className={styles['checkbox-container']}>
                <Checkbox isSelected={isSelected} />
            </div>
        </IonButton>
    );
};

export default VocabularyListLineCheckbox;
