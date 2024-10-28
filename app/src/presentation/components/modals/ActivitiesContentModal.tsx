import { IonModal } from '@ionic/react';
import Profile from '../../../domain/entities/Profile';
import ActivitiesContainerContent from '../contents/activity/ActivitiesContainerContent';
import styles from './ActivitiesContentModal.module.css';

interface ActivitiesContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
}

const ActivitiesContentModal: React.FC<ActivitiesContentModalProps> = ({ isVisible, onClose, profile }) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.content}>
                <ActivitiesContainerContent onClose={onClose} profile={profile} isModal={true} />
            </div>
        </IonModal>
    );
};

export default ActivitiesContentModal;
