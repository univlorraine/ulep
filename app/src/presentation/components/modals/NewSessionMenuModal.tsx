import { IonModal } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreState } from '../../../store/storeTypes';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import SelectTandemContent from '../contents/SelectTandemContent';
import SessionFormContent from '../contents/SessionFormContent';
import ShowSessionContent from '../contents/ShowSessionContent';
import { DisplaySessionModal, DisplaySessionModalEnum } from './SessionsContentModal';

interface NewSessionMenuModalProps {
    isVisible: boolean;
    onClose: () => void;
    setRefreshSessions?: (value: boolean) => void;
}

const NewSessionMenuModal: React.FC<NewSessionMenuModalProps> = ({ isVisible, onClose, setRefreshSessions }) => {
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();
    const [displaySessionContent, setDisplaySessionContent] = useState<DisplaySessionModal>();
    const history = useHistory();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    const profile = useStoreState((state) => state.profile);

    const onSelectedTandem = (tandem: Tandem) => {
        setSelectedTandem(tandem);
    };

    const onShowSessionPressed = (session: Session, tandem: Tandem, confirmCreation?: boolean) => {
        if (isHybrid) {
            history.push('show-session', { session, tandem, confirmCreation });
        } else {
            setRefreshSessions && setRefreshSessions(true);
            setDisplaySessionContent({
                type: DisplaySessionModalEnum.show,
                tandem,
                session,
                confirmCreation,
            });
        }
    };

    const onBackPressed = () => {
        setSelectedTandem(undefined);
        setDisplaySessionContent(undefined);
        onClose();
    };

    if (!profile) {
        return null;
    }

    return (
        <>
            <IonModal
                animated
                isOpen={isVisible}
                onDidDismiss={onBackPressed}
                className={`modal modal-side ${isHybrid ? 'hybrid' : ''}`}
            >
                {!selectedTandem && (
                    <SelectTandemContent
                        onBackPressed={onBackPressed}
                        setSelectedTandem={onSelectedTandem}
                        profile={profile}
                    />
                )}
                {selectedTandem && !displaySessionContent?.session && (
                    <SessionFormContent
                        goBack={() => setSelectedTandem(undefined)}
                        isHybrid={false}
                        profile={profile}
                        tandem={selectedTandem}
                        onShowSessionPressed={onShowSessionPressed}
                    />
                )}
                {displaySessionContent && displaySessionContent.session && displaySessionContent.tandem && (
                    <ShowSessionContent
                        goBack={onBackPressed}
                        isHybrid={false}
                        profile={profile}
                        session={displaySessionContent.session}
                        tandem={displaySessionContent.tandem}
                        confirmCreation={displaySessionContent.confirmCreation || false}
                        onUpdateSessionPressed={() => {}}
                    />
                )}
            </IonModal>
        </>
    );
};

export default NewSessionMenuModal;
