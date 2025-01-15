import { IonModal } from '@ionic/react';
import Profile from '../../../domain/entities/Profile';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import SessionFormContent from '../contents/SessionFormContent';
import SessionListContent from '../contents/SessionListContent';
import ShowSessionContent from '../contents/ShowSessionContent';

export const DisplaySessionModalEnum = {
    list: 'list',
    form: 'form',
    show: 'show',
};

export interface DisplaySessionModal {
    type: (typeof DisplaySessionModalEnum)[keyof typeof DisplaySessionModalEnum];
    tandem?: Tandem;
    session?: Session;
    confirmCreation?: boolean;
}

interface SessionsContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
    tandems: Tandem[];
    sessions: Session[];
    displaySessionModal?: DisplaySessionModal;
    onCreateSessionPressed: (tandem: Tandem) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
    onShowSessionPressed: (session: Session, tandem: Tandem, confirmCreation?: boolean) => void;
}

const SessionsContentModal: React.FC<SessionsContentModalProps> = ({
    isVisible,
    onClose,
    profile,
    tandems,
    sessions,
    displaySessionModal,
    onCreateSessionPressed,
    onUpdateSessionPressed,
    onShowSessionPressed,
}) => {
    if (!displaySessionModal) {
        return null;
    }

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className="modal modal-side">
            <>
                {displaySessionModal?.type === DisplaySessionModalEnum.list && (
                    <SessionListContent
                        goBack={onClose}
                        isHybrid={false}
                        tandems={tandems}
                        sessions={sessions}
                        onCreateSessionPressed={onCreateSessionPressed}
                        onUpdateSessionPressed={onUpdateSessionPressed}
                        onShowSessionPressed={onShowSessionPressed}
                    />
                )}
                {displaySessionModal?.type === DisplaySessionModalEnum.form && displaySessionModal.tandem && (
                    <SessionFormContent
                        goBack={onClose}
                        isHybrid={false}
                        profile={profile}
                        tandem={displaySessionModal.tandem}
                        session={displaySessionModal.session}
                        onShowSessionPressed={onShowSessionPressed}
                    />
                )}
                {displaySessionModal?.type === DisplaySessionModalEnum.show &&
                    displaySessionModal.session &&
                    displaySessionModal.tandem && (
                        <ShowSessionContent
                            goBack={onClose}
                            isHybrid={false}
                            profile={profile}
                            session={displaySessionModal.session}
                            tandem={displaySessionModal.tandem}
                            confirmCreation={displaySessionModal.confirmCreation || false}
                            onUpdateSessionPressed={onUpdateSessionPressed}
                        />
                    )}
            </>
        </IonModal>
    );
};

export default SessionsContentModal;
