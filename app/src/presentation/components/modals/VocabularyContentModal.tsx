import { IonModal } from '@ionic/react';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import VocabularyContent from '../contents/VocabularyContent';
import styles from './VocabularyContentModal.module.css';

interface VocabularyContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
    currentLearningLanguage: LearningLanguage;
    currentVocabularyListId?: string;
}

const VocabularyContentModal: React.FC<VocabularyContentModalProps> = ({
    isVisible,
    onClose,
    profile,
    currentLearningLanguage,
    currentVocabularyListId,
}) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div>
                <VocabularyContent
                    profile={profile}
                    onClose={onClose}
                    currentLearningLanguage={currentLearningLanguage}
                    currentVocabularyListId={currentVocabularyListId}
                    isModal
                />
            </div>
        </IonModal>
    );
};

export default VocabularyContentModal;
