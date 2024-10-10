import { IonModal } from '@ionic/react';
import ReportContent from '../contents/ReportContent';

interface ReportModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isVisible, onClose }) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose}>
            <ReportContent onClose={onClose} />
        </IonModal>
    );
};

export default ReportModal;
