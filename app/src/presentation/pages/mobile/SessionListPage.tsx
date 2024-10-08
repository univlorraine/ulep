import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useStoreState } from '../../../store/storeTypes';
import SessionListContent from '../../components/contents/SessionListContent';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';

interface SessionListPageProps {
    tandems: Tandem[];
    sessions: Session[];
}

const SessionListPage = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const location = useLocation<SessionListPageProps>();
    const { tandems, sessions } = location.state;


    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/home');
    };

    const onCreateSessionPressed = (tandem: Tandem) => {
        history.push('create-session', { tandem });
    };

    const onShowSessionPressed = (session: Session, tandem: Tandem) => {
        history.push('show-session', { session, tandem });
    };

    const onUpdateSessionPressed = (session: Session, tandem: Tandem) => {
        history.push('update-session', { session, tandem });
    };

    return (
        <IonContent>
            <SessionListContent
                goBack={goBack}
                isHybrid
                tandems={tandems}
                sessions={sessions}
                onCreateSessionPressed={onCreateSessionPressed}
                onShowSessionPressed={onShowSessionPressed}
                onUpdateSessionPressed={onUpdateSessionPressed}
            />
        </IonContent>
    );
};

export default SessionListPage;
