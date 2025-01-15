import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useStoreState } from '../../../store/storeTypes';
import ShowSessionContent from '../../components/contents/ShowSessionContent';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';

interface ShowSessionPageProps {
    session: Session;
    tandem: Tandem;
    confirmCreation?: boolean;
}

const ShowSessionPage = () => {
    const history = useHistory();
    const location = useLocation<ShowSessionPageProps>();
    const { tandem, session, confirmCreation = false } = location.state;
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/home');
    };

    const onUpdateSessionPressed = (session: Session, tandem: Tandem) => {
        history.push('/update-session', { session, tandem });
    };

    return (
        <IonContent>
            <ShowSessionContent
                goBack={goBack}
                isHybrid
                profile={profile}
                session={session}
                tandem={tandem}
                confirmCreation={confirmCreation}
                onUpdateSessionPressed={onUpdateSessionPressed}
            />
        </IonContent>
    );
};

export default ShowSessionPage;