import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { ArrowRightSvg } from '../../../assets';
import VocabularyList from '../../../domain/entities/VocabularyList';
import styles from './VocabularyListCard.module.css';

interface VocabularyListCardProps {
    vocabularyList: VocabularyList;
    onPress?: (vocabularyList: VocabularyList) => void;
}

const VocabularyListCard: React.FC<VocabularyListCardProps> = ({ vocabularyList, onPress }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <span className={styles.header}>{t('vocabulary.list.card.title')}</span>
            <div className={styles.content}>
                <div className={styles.titleContainer}>
                    <span className={styles.title}>{`${vocabularyList.symbol} ${vocabularyList.name}`}</span>
                    <span className={styles.creator}>
                        {t('vocabulary.list.card.creator', { name: vocabularyList.creatorName })}
                    </span>
                </div>
                {onPress && (
                    <IonButton
                        fill="clear"
                        size="small"
                        className={styles.button}
                        onClick={() => onPress(vocabularyList)}
                    >
                        <IonIcon icon={ArrowRightSvg} />
                    </IonButton>
                )}
            </div>
        </div>
    );
};

export default VocabularyListCard;
