import { IonButton, IonIcon, IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { AddSvg, LeftChevronSvg, VocabularySvg } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import VocabularyListLine from '../vocabulary/VocabularyListLine';
import styles from './VocabularyListContent.module.css';

interface VocabularyListContentProps {
    goBack?: () => void;
    profile: Profile;
    vocabularyLists: VocabularyList[];
    onAddVocabularyList: () => void;
    onSelectVocabularyList: (vocabularyList: VocabularyList) => void;
    isLoading: boolean;
}

const VocabularyListContent: React.FC<VocabularyListContentProps> = ({
    profile,
    vocabularyLists,
    goBack,
    onAddVocabularyList,
    onSelectVocabularyList,
    isLoading,
}) => {
    const { t } = useTranslation();

    return (
        <div className={`${styles.container} content-wrapper`}>
            <div className={styles.header}>
                {goBack && (
                    <IonButton fill="clear" onClick={goBack} aria-label={t('vocabulary.list.go_back') as string}>
                        <IonIcon icon={LeftChevronSvg} size="small" aria-hidden="true" />
                    </IonButton>
                )}
                <div className={styles['title-container']}>
                    <h2 className={styles.title}>{t('vocabulary.list.title')}</h2>
                </div>
                <div />
            </div>
            <div className={styles.content}>
                {!isLoading && vocabularyLists.length === 0 && (
                    <>
                        <IonImg alt="" aria-hidden src={VocabularySvg} />
                        <p>{t('vocabulary.list.empty')}</p>
                        <IonButton className="secondary-button" fill="clear" onClick={onAddVocabularyList}>
                            <IonIcon aria-hidden slot="start" name="add-outline" />
                            {t('vocabulary.list.create')}
                        </IonButton>
                    </>
                )}
                {!isLoading &&
                    vocabularyLists.length > 0 &&
                    vocabularyLists.map((vocabularyList) => (
                        <VocabularyListLine
                            key={vocabularyList.id}
                            profile={profile}
                            vocabularyList={vocabularyList}
                            onSelectVocabularyList={onSelectVocabularyList}
                        />
                    ))}
            </div>

            <IonButton fill="clear" className={styles.addButton} onClick={onAddVocabularyList}>
                <IonImg aria-hidden className={styles.addIcon} src={AddSvg} />
            </IonButton>
        </div>
    );
};

export default VocabularyListContent;
