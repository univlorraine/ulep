import { IonModal } from '@ionic/react';
import EndSessionContent from '../contents/EndSessionContent';

type EndSessionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCompleteLearningJournalPressed: () => void;
};

const EndSessionModal: React.FC<EndSessionModalProps> = ({ isOpen, onClose, onCompleteLearningJournalPressed }) => {
    return (
        <IonModal className="end-session-modal" isOpen={isOpen} onDidDismiss={onClose}>
            <EndSessionContent onClose={onClose} onCompleteLearningJournalPressed={onCompleteLearningJournalPressed} />
        </IonModal>
    );
};

export default EndSessionModal;
