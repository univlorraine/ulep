import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import VocabularyListLine from '../vocabulary/VocabularyListLine';
import styles from './SelectVocabularyListModal.module.css';

interface SelectVocabularyListModalProps {
    isVisible: boolean;
    onClose: () => void;
    onValidate: (vocabularyList: VocabularyList) => void;
    profile: Profile;
    vocabularyLists: VocabularyList[];
    isHybrid?: boolean;
}

const SelectVocabularyListModal: React.FC<SelectVocabularyListModalProps> = ({
    isVisible,
    onClose,
    onValidate,
    profile,
    vocabularyLists,
    isHybrid,
}) => {
    const { t } = useTranslation();
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={`${styles.container} ${isHybrid && styles.mobileContainer}`}>
                <IonButton
                    aria-label={t('chat.vocabulary_list.close') as string}
                    size="small"
                    fill="clear"
                    color="dark"
                    className={styles.close}
                    onClick={onClose}
                >
                    <IonIcon icon={closeCircle} slot="icon-only" className={styles.close_icon} />
                </IonButton>
                <span className={styles.title}>{t('chat.vocabulary_list.title')}</span>

                <div className={styles.list}>
                    {vocabularyLists
                        .filter((vocabularyList) => vocabularyList.numberOfVocabularies > 0)
                        .map((vocabularyList) => (
                            <VocabularyListLine
                                vocabularyList={vocabularyList}
                                profile={profile}
                                onSelectVocabularyList={() => onValidate(vocabularyList)}
                            />
                        ))}
                </div>
            </div>
        </IonModal>
    );
};

export default SelectVocabularyListModal;
