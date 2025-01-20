import { IonModal } from '@ionic/react';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import ActivitiesContainerContent from '../contents/activity/ActivitiesContainerContent';
import styles from './ActivitiesContentModal.module.css';

interface ActivitiesContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
    currentActivityId?: string;
    currentLearningLanguage?: Language;
}

const ActivitiesContentModal: React.FC<ActivitiesContentModalProps> = ({
    isVisible,
    onClose,
    profile,
    currentActivityId,
    currentLearningLanguage,
}) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.content}>
                <ActivitiesContainerContent
                    onClose={onClose}
                    profile={profile}
                    isModal={true}
                    currentActivityId={currentActivityId}
                    currentLearningLanguage={currentLearningLanguage}
                />
            </div>
        </IonModal>
    );
};

export default ActivitiesContentModal;
