import { IonButton, IonIcon, IonImg, IonItem, IonLabel, IonList, IonSearchbar, useIonToast } from '@ionic/react';
import { arrowRedoOutline, downloadOutline, pencilOutline, trashOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg, VocabularyPng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Vocabulary from '../../../domain/entities/Vocabulary';
import VocabularyList from '../../../domain/entities/VocabularyList';
import HeaderSubContent from '../HeaderSubContent';
import ConfirmModal from '../modals/ConfirmModal';
import VocabularyLine from '../vocabulary/VocabularyLine';
import styles from './VocabularyListContent.module.css';

interface VocabularyContentProps {
    goBack?: () => void;
    profile: Profile;
    vocabularyList: VocabularyList;
    vocabularyPairs: Vocabulary[];
    isLoading: boolean;
    onAddVocabulary: (vocabulary?: Vocabulary) => void;
    onUpdateVocabularyList: () => void;
    onDeleteVocabularyList: () => void;
    onSearch: (search: string) => void;
    onShareVocabularyList: () => void;
    onUnshareVocabularyList: () => void;
    setQuizzSelectedListIds: (selectedListsIds: string[]) => void;
}

const VocabularyItemContent: React.FC<VocabularyContentProps> = ({
    profile,
    vocabularyList,
    vocabularyPairs,
    goBack,
    isLoading,
    onAddVocabulary,
    onUpdateVocabularyList,
    onDeleteVocabularyList,
    onSearch,
    onShareVocabularyList,
    onUnshareVocabularyList,
    setQuizzSelectedListIds,
}) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { getVocabularyListPdf } = useConfig();
    const [showDeleteVocabularyListModal, setShowDeleteVocabularyListModal] = useState(false);
    const [search, setSearch] = useState('');
    const isVocabularyListMine = vocabularyList.isMine(profile);
    const isVocabularyListShared = vocabularyList.editorsIds.length > 1;

    const exportToPdf = async () => {
        const result = await getVocabularyListPdf.execute(vocabularyList.id);

        if (result instanceof Error) {
            return showToast({
                message: t(result.message),
                duration: 3000,
            });
        }
    };

    const onSearchChange = (search: string) => {
        setSearch(search);
        onSearch(search);
    };

    const onShareVocabularyListPressed = () => {
        onShareVocabularyList();
    };

    const onUnshareVocabularyListPressed = () => {
        onUnshareVocabularyList();
    };

    const onStartQuizzPressed = () => {
        const selectedListsId = [vocabularyList.id];
        setQuizzSelectedListIds(selectedListsId);
    };

    let vocabulariesWithoutPronunciation;
    if (
        [profile.nativeLanguage, ...profile.masteredLanguages].filter(
            (language) => language.code === vocabularyList.targetLanguage.code
        ).length > 0
    ) {
        vocabulariesWithoutPronunciation = vocabularyPairs.filter((vocabulary) => {
            return !vocabulary.pronunciationTranslationUrl;
        });
    } else if (
        [profile.nativeLanguage, ...profile.masteredLanguages].filter(
            (language) => language.code === vocabularyList.translationLanguage.code
        ).length > 0
    ) {
        vocabulariesWithoutPronunciation = vocabularyPairs.filter((vocabulary) => {
            return !vocabulary.pronunciationWordUrl;
        });
    }

    return (
        <div>
            <HeaderSubContent
                title={`${vocabularyList.symbol} ${vocabularyList.name}`}
                onBackPressed={() => goBack?.()}
                kebabContent={(closeMenu) => (
                    <IonList lines="none">
                        {isVocabularyListMine && (
                            <IonItem
                                button={true}
                                detail={false}
                                onClick={() => {
                                    isVocabularyListShared
                                        ? onUnshareVocabularyListPressed()
                                        : onShareVocabularyListPressed();
                                    closeMenu();
                                }}
                            >
                                <IonIcon icon={arrowRedoOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>
                                    {isVocabularyListShared
                                        ? t('vocabulary.pair.unshare_button')
                                        : t('vocabulary.pair.share_button')}
                                </IonLabel>
                            </IonItem>
                        )}
                        <IonItem
                            button={true}
                            detail={false}
                            onClick={() => {
                                exportToPdf();
                                closeMenu();
                            }}
                        >
                            <IonIcon icon={downloadOutline} aria-hidden="true" />
                            <IonLabel className={styles['popover-label']}>{t('vocabulary.pair.export')}</IonLabel>
                        </IonItem>
                        {isVocabularyListMine && (
                            <IonItem
                                button={true}
                                detail={false}
                                onClick={() => {
                                    onUpdateVocabularyList();
                                    closeMenu();
                                }}
                            >
                                <IonIcon icon={pencilOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>
                                    {t('vocabulary.list.update.title')}
                                </IonLabel>
                            </IonItem>
                        )}
                        {isVocabularyListMine && (
                            <IonItem
                                button={true}
                                detail={false}
                                onClick={() => {
                                    setShowDeleteVocabularyListModal(true);
                                    closeMenu();
                                }}
                            >
                                <IonIcon icon={trashOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>
                                    {t('vocabulary.list.delete.title')}
                                </IonLabel>
                            </IonItem>
                        )}
                        <IonItem
                            button={true}
                            detail={false}
                            onClick={() => {
                                onStartQuizzPressed();
                                closeMenu();
                            }}
                        >
                            <IonIcon icon={arrowRedoOutline} aria-hidden="true" />
                            <IonLabel className={styles['popover-label']}>
                                {t('vocabulary.list.start_quiz_menu')}
                            </IonLabel>
                        </IonItem>
                    </IonList>
                )}
            />
            <div className={styles.content}>
                {!isLoading && !search && vocabularyPairs.length === 0 && (
                    <div className={styles.emptyContainer}>
                        <IonImg alt="" aria-hidden className={styles.emptyImage} src={VocabularyPng} />
                        <p className={styles.emptyText}>{t('vocabulary.pair.empty')}</p>
                        <IonButton
                            className="tertiary-button no-padding"
                            fill="clear"
                            onClick={() => onAddVocabulary()}
                        >
                            <IonIcon aria-hidden slot="start" name="add-outline" />
                            {t('vocabulary.pair.create')}
                        </IonButton>
                    </div>
                )}
                {!isLoading && (vocabularyPairs.length > 0 || search) && (
                    <IonSearchbar
                        placeholder={t('vocabulary.pair.search') as string}
                        onIonChange={(e) => onSearchChange(e.detail.value as string)}
                        value={search}
                    />
                )}

                {!isLoading &&
                    vocabulariesWithoutPronunciation &&
                    vocabulariesWithoutPronunciation.length > 0 &&
                    vocabularyList.isEditable && (
                        <>
                            <div className={styles.pronunciationTitle}>
                                <span>{t('vocabulary.pair.without_pronunciation')}</span>
                            </div>
                            {vocabulariesWithoutPronunciation.map((vocabulary) => (
                                <VocabularyLine
                                    key={vocabulary.id}
                                    onVocabularyClick={onAddVocabulary}
                                    vocabulary={vocabulary}
                                />
                            ))}
                            <div className={styles.pronunciationTitle}>
                                <span>{t('vocabulary.pair.every_pronunciation')}</span>
                            </div>
                        </>
                    )}
                {!isLoading &&
                    vocabularyPairs.length > 0 &&
                    vocabularyPairs.map((vocabulary) => (
                        <VocabularyLine
                            key={vocabulary.id}
                            onVocabularyClick={onAddVocabulary}
                            vocabulary={vocabulary}
                            isEditable={vocabularyList.isEditable}
                        />
                    ))}
            </div>

            {vocabularyList.isEditable && (
                <IonButton fill="clear" className={styles.addButton} onClick={() => onAddVocabulary()}>
                    <IonImg aria-hidden className={styles.addIcon} src={AddSvg} />
                </IonButton>
            )}

            <ConfirmModal
                isVisible={showDeleteVocabularyListModal}
                onClose={() => setShowDeleteVocabularyListModal(false)}
                onValidate={() => onDeleteVocabularyList()}
                title={t('vocabulary.list.delete.modal')}
            />
        </div>
    );
};

export default VocabularyItemContent;
