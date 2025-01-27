import { IonModal } from '@ionic/react';
import Profile from '../../../domain/entities/Profile';
import useGetEdito from '../../hooks/useGetEdito';
import EditoContent from '../contents/EditoContent';
import styles from './ActivitiesContentModal.module.css';

interface EditoContentModalProps {
    universityId?: string;
    onClose: () => void;
    profile: Profile;
}

const EditoContentModal: React.FC<EditoContentModalProps> = ({ universityId, onClose, profile }) => {
    const { edito } = useGetEdito(universityId);
    return (
        <IonModal animated isOpen={Boolean(edito)} onDidDismiss={onClose} className={styles.modal}>
            {edito && <EditoContent edito={edito} onGoBack={onClose} />}
        </IonModal>
    );
};

export default EditoContentModal;
