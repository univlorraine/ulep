import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import Checkbox from '../Checkbox';
import VocabularyListLineCheckbox from '../vocabulary/VocabularyListLineCheckbox';
import styles from './SelectVocabularyListsForQuizModal.module.css';

interface SelectVocabularyListsForQuizModaleProps {
    isVisible: boolean;
    onClose: () => void;
    onValidate: (selectedLists: VocabularyList[]) => void;
    vocabularyLists: VocabularyList[];
    profile: Profile;
    isHybrid?: boolean;
}

const SelectVocabularyListsForQuizModale: React.FC<SelectVocabularyListsForQuizModaleProps> = ({
    isVisible,
    onClose,
    onValidate,
    vocabularyLists,
    profile,
    isHybrid,
}) => {
    const { t } = useTranslation();
    const [selectedLists, setSelectedLists] = useState<VocabularyList[]>([]);

    const onSelectVocabularyList = (vocabularyList: VocabularyList) => {
        if (selectedLists.includes(vocabularyList)) {
            setSelectedLists(selectedLists.filter((list) => list !== vocabularyList));
        } else {
            setSelectedLists([...selectedLists, vocabularyList]);
        }
    };

    const onSelectAllVocabularyLists = () => {
        if (selectedLists.length === vocabularyLists.length) {
            setSelectedLists([]);
        } else {
            setSelectedLists(vocabularyLists);
        }
    };

    useEffect(() => {
        setSelectedLists([]);
    }, [isVisible]);

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={`${styles.container} ${isHybrid && styles.mobileContainer}`}>
                <IonButton size="small" fill="clear" color="dark" className={styles.close} onClick={onClose}>
                    <IonIcon
                        aria-label={t('vocabulary.list.start_quiz.close') as string}
                        icon={closeCircle}
                        slot="icon-only"
                        className={styles.close_icon}
                    />
                </IonButton>
                <span className={styles.title}>{t('vocabulary.list.start_quiz.title')}</span>

                <div className={styles.list}>
                    <IonButton
                        aria-label={t('vocabulary.list.start_quiz.all_lists') as string}
                        fill="clear"
                        className={styles.item_all_lists}
                        onClick={() => onSelectAllVocabularyLists()}
                    >
                        <div className={styles.all_lists}>
                            <div className={styles.content}>
                                <span className={styles.title}>{t('vocabulary.list.start_quiz.all_lists')}</span>
                            </div>
                            <div className={styles['checkbox-container']}>
                                <Checkbox
                                    isSelected={selectedLists.length === vocabularyLists.length}
                                    className={styles.checkbox}
                                />
                            </div>
                        </div>
                    </IonButton>
                    {vocabularyLists
                        .filter((vocabularyList) => vocabularyList.numberOfVocabularies > 0)
                        .map((vocabularyList) => (
                            <VocabularyListLineCheckbox
                                key={vocabularyList.id}
                                profile={profile}
                                vocabularyList={vocabularyList}
                                onSelectVocabularyList={() => onSelectVocabularyList(vocabularyList)}
                                isSelected={selectedLists.includes(vocabularyList)}
                            />
                        ))}
                </div>
                <IonButton
                    className={`secondary-button ${styles.button}`}
                    fill="clear"
                    onClick={() => onValidate(selectedLists)}
                >
                    {t('vocabulary.list.start_quiz.create')}
                </IonButton>
            </div>
        </IonModal>
    );
};

export default SelectVocabularyListsForQuizModale;
