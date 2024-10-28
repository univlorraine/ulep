import { IonModal } from '@ionic/react';
import Profile from '../../../domain/entities/Profile';
import VocabularyContent from '../contents/VocabularyContent';
import styles from './VocabularyContentModal.module.css';

interface VocabularyContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
}

const VocabularyContentModal: React.FC<VocabularyContentModalProps> = ({ isVisible, onClose, profile }) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.content}>
                <VocabularyContent profile={profile} onClose={onClose} isModal />
            </div>
        </IonModal>
    );
};

export default VocabularyContentModal;
