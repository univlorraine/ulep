import { IonButton, IonIcon, IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { AddSvg, FlashcardPng, VocabularyPng } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import HeaderSubContent from '../HeaderSubContent';
import VocabularyListLine from '../vocabulary/VocabularyListLine';
import styles from './VocabularyListContent.module.css';

interface VocabularyListContentProps {
    goBack?: () => void;
    profile: Profile;
    vocabularyLists: VocabularyList[];
    onAddVocabularyList: () => void;
    onSelectVocabularyList: (vocabularyList: VocabularyList) => void;
    isLoading: boolean;
    onStartQuiz: () => void;
    isModal?: boolean;
}

const VocabularyListContent: React.FC<VocabularyListContentProps> = ({
    profile,
    vocabularyLists,
    goBack,
    onAddVocabularyList,
    onSelectVocabularyList,
    isLoading,
    onStartQuiz,
    isModal,
}) => {
    const { t } = useTranslation();

    return (
        <div>
            <HeaderSubContent
                isBackButton={isModal}
                title={t('vocabulary.list.title')}
                onBackPressed={() => goBack?.()}
            />
            <div className={styles.content}>
                {!isLoading && vocabularyLists.length === 0 && (
                    <div className={styles.emptyContainer}>
                        <IonImg alt="" aria-hidden className={styles.emptyImage} src={VocabularyPng} />
                        <p className={styles.emptyText}>{t('vocabulary.list.empty')}</p>
                        <IonButton className="tertiary-button no-padding" fill="clear" onClick={onAddVocabularyList}>
                            <IonIcon aria-hidden slot="start" name="add-outline" />
                            {t('vocabulary.list.create.title')}
                        </IonButton>
                    </div>
                )}
                {!isLoading &&
                    vocabularyLists.length > 0 &&
                    vocabularyLists.map((vocabularyList) => (
                        <VocabularyListLine
                            key={vocabularyList.id}
                            profile={profile}
                            vocabularyList={vocabularyList}
                            onSelectVocabularyList={onSelectVocabularyList}
                            isEditable={vocabularyList.isEditable}
                        />
                    ))}

                {vocabularyLists.length > 0 &&
                    vocabularyLists.filter((vocabularyList) => vocabularyList.numberOfVocabularies > 0).length > 0 && (
                        <div className={styles.flashcard}>
                            <IonImg aria-hidden className={styles.flashcardImage} src={FlashcardPng} />
                            <p className={styles.title}>{t('vocabulary.list.flashcard.title')}</p>
                            <p className={styles.text}>{t('vocabulary.list.flashcard.paragraph')}</p>
                            <IonButton
                                className="primary-button"
                                fill="clear"
                                size="small"
                                onClick={() => onStartQuiz()}
                            >
                                {t('vocabulary.list.flashcard.button')}
                            </IonButton>
                        </div>
                    )}
            </div>

            <IonButton fill="clear" className="add-button" onClick={onAddVocabularyList}>
                <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
            </IonButton>
        </div>
    );
};

export default VocabularyListContent;
