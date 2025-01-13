import { IonModal } from '@ionic/react';
import EndSessionContent from '../contents/EndSessionContent';

type EndSessionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCompleteLearningJournalPressed: () => void;
    duration?: number;
    partnerTandemId?: string;
    tandemFirstname?: string;
    tandemLastname?: string;
    learningLanguageId: string;
};

const EndSessionModal: React.FC<EndSessionModalProps> = ({
    isOpen,
    onClose,
    onCompleteLearningJournalPressed,
    duration,
    partnerTandemId,
    tandemFirstname,
    tandemLastname,
    learningLanguageId,
}) => {
    return (
        <IonModal className="end-session-modal" isOpen={isOpen} onDidDismiss={onClose}>
            <EndSessionContent
                onClose={onClose}
                onCompleteLearningJournalPressed={onCompleteLearningJournalPressed}
                duration={duration}
                partnerTandemId={partnerTandemId}
                tandemFirstname={tandemFirstname}
                tandemLastname={tandemLastname}
                learningLanguageId={learningLanguageId}
            />
        </IonModal>
    );
};

export default EndSessionModal;
