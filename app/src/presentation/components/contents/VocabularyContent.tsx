import {
    IonButton,
    IonContent,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonPopover,
    IonSearchbar,
    useIonToast,
} from '@ionic/react';
import { arrowRedoOutline, downloadOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg, KebabSvg, LeftChevronSvg, VocabularyPng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Vocabulary from '../../../domain/entities/Vocabulary';
import VocabularyList from '../../../domain/entities/VocabularyList';
import VocabularyLine from '../vocabulary/VocabularyLine';
import styles from './VocabularyListContent.module.css';

interface VocabularyContentProps {
    goBack?: () => void;
    profile: Profile;
    vocabularyList: VocabularyList;
    vocabularyPairs: Vocabulary[];
    isLoading: boolean;
    onAddVocabulary: (vocabulary?: Vocabulary) => void;
    onSearch: (search: string) => void;
    onShareVocabularyList: () => void;
}

const VocabularyContent: React.FC<VocabularyContentProps> = ({
    profile,
    vocabularyList,
    vocabularyPairs,
    goBack,
    isLoading,
    onAddVocabulary,
    onSearch,
    onShareVocabularyList,
}) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { getVocabularyListPdf } = useConfig();
    const [showMenu, setShowMenu] = useState(false);
    const [search, setSearch] = useState('');

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
        setShowMenu(false);
        onShareVocabularyList();
    };

    let vocabulariesWithoutPronunciation;
    if (
        [profile.nativeLanguage, ...profile.masteredLanguages].filter(
            (language) => language.code === vocabularyList.wordLanguage.code
        ).length > 0
    ) {
        vocabulariesWithoutPronunciation = vocabularyPairs.filter((vocabulary) => {
            return !vocabulary.pronunciationWordUrl;
        });
    } else if (
        [profile.nativeLanguage, ...profile.masteredLanguages].filter(
            (language) => language.code === vocabularyList.translationLanguage.code
        ).length > 0
    ) {
        vocabulariesWithoutPronunciation = vocabularyPairs.filter((vocabulary) => {
            return !vocabulary.pronunciationTranslationUrl;
        });
    }

    return (
        <div className={`${styles.container} content-wrapper`}>
            <div className={styles.header}>
                {goBack && (
                    <IonButton fill="clear" onClick={goBack} aria-label={t('vocabulary.pair.go_back') as string}>
                        <IonIcon icon={LeftChevronSvg} size="small" aria-hidden="true" />
                    </IonButton>
                )}
                <h2 className={styles.title}>{`${vocabularyList.symbol} ${vocabularyList.name}`}</h2>
                <IonButton
                    fill="clear"
                    id="click-trigger"
                    onClick={() => setShowMenu(!showMenu)}
                    aria-label={t('vocabulary.pair.menu') as string}
                >
                    <IonIcon icon={KebabSvg} size="medium" aria-hidden="true" />
                </IonButton>
                <IonPopover trigger="click-trigger" triggerAction="click" isOpen={showMenu} showBackdrop={false}>
                    <IonContent>
                        <IonList lines="none">
                            <IonItem button={true} detail={false} onClick={onShareVocabularyListPressed}>
                                <IonIcon icon={arrowRedoOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>
                                    {t('vocabulary.pair.share_button')}
                                </IonLabel>
                            </IonItem>
                            <IonItem button={true} detail={false} onClick={exportToPdf}>
                                <IonIcon icon={downloadOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>{t('vocabulary.pair.export')}</IonLabel>
                            </IonItem>
                        </IonList>
                    </IonContent>
                </IonPopover>
            </div>
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
                {!isLoading && vocabularyPairs.length > 0 && (
                    <IonSearchbar
                        placeholder={t('vocabulary.pair.search') as string}
                        onIonChange={(e) => onSearchChange(e.detail.value as string)}
                        value={search}
                    />
                )}

                {!isLoading && vocabulariesWithoutPronunciation && vocabulariesWithoutPronunciation.length > 0 && (
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
                        />
                    ))}
            </div>

            <IonButton fill="clear" className={styles.addButton} onClick={() => onAddVocabulary()}>
                <IonImg aria-hidden className={styles.addIcon} src={AddSvg} />
            </IonButton>
        </div>
    );
};

export default VocabularyContent;
