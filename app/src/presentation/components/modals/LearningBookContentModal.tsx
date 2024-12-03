import { IonModal } from '@ionic/react';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import LearningBookContainerContent from '../contents/learning-book/LearningBookContainerContent';
import styles from './LearningBookContentModal.module.css';

interface LearningBookContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
    onOpenVocabularyList: () => void;
    learningLanguage?: LearningLanguage;
}

const LearningBookContentModal: React.FC<LearningBookContentModalProps> = ({
    isVisible,
    onClose,
    onOpenVocabularyList,
    profile,
    learningLanguage,
}) => {
    if (!learningLanguage) {
        return null;
    }

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.content}>
                <LearningBookContainerContent
                    onClose={onClose}
                    onOpenVocabularyList={onOpenVocabularyList}
                    profile={profile}
                    learningLanguage={learningLanguage}
                />
            </div>
        </IonModal>
    );
};

export default LearningBookContentModal;
