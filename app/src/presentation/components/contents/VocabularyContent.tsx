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
} from '@ionic/react';
import { arrowRedoOutline, downloadOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg, KebabSvg, LeftChevronSvg, VocabularySvg } from '../../../assets';
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
}

const VocabularyContent: React.FC<VocabularyContentProps> = ({
    profile,
    vocabularyList,
    vocabularyPairs,
    goBack,
    isLoading,
    onAddVocabulary,
    onSearch,
}) => {
    const { t } = useTranslation();
    const [showMenu, setShowMenu] = useState(false);
    const [search, setSearch] = useState('');
    const [share, setShare] = useState(false);

    const exportToPdf = () => {
        console.log('export to pdf');
    };

    const onSearchChange = (search: string) => {
        setSearch(search);
        onSearch(search);
    };

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
                            <IonItem button={true} detail={false} onClick={() => setShare(true)}>
                                <IonIcon icon={arrowRedoOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>{t('vocabulary.pair.share')}</IonLabel>
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
                        <IonImg alt="" aria-hidden className={styles.emptyImage} src={VocabularySvg} />
                        <p className={styles.emptyText}>{t('vocabulary.pair.empty')}</p>
                        <IonButton className="tertiary-button" fill="clear" onClick={() => onAddVocabulary()}>
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
