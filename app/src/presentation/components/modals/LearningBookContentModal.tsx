import { IonModal } from '@ionic/react';
import Profile from '../../../domain/entities/Profile';
import LearningBookContainerContent from '../contents/learning-book/LearningBookContainerContent';
import styles from './LearningBookContentModal.module.css';

interface LearningBookContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
}

const LearningBookContentModal: React.FC<LearningBookContentModalProps> = ({ isVisible, onClose, profile }) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.content}>
                <LearningBookContainerContent onClose={onClose} profile={profile} />
            </div>
        </IonModal>
    );
};

export default LearningBookContentModal;
