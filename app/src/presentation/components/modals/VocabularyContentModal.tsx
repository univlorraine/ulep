import { IonModal } from '@ionic/react';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import VocabularyContent from '../contents/VocabularyContent';
import styles from './VocabularyContentModal.module.css';

interface VocabularyContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
    currentLearningLanguage: Language;
}

const VocabularyContentModal: React.FC<VocabularyContentModalProps> = ({
    isVisible,
    onClose,
    profile,
    currentLearningLanguage,
}) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.content}>
                <VocabularyContent
                    profile={profile}
                    onClose={onClose}
                    currentLearningLanguage={currentLearningLanguage}
                    isModal
                />
            </div>
        </IonModal>
    );
};

export default VocabularyContentModal;
