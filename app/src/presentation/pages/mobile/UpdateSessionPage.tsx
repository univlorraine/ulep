import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Tandem from '../../../domain/entities/Tandem';
import SessionFormContent from '../../components/contents/SessionFormContent';
import Session from '../../../domain/entities/Session';
import { useStoreState } from '../../../store/storeTypes';

interface UpdateSessionPageProps {
    tandem: Tandem;
    session: Session;
}

const UpdateSessionPage = () => {
    const history = useHistory();
    const location = useLocation<UpdateSessionPageProps>();
    const { tandem, session } = location.state;
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.goBack();
    };

    const onShowSessionPressed = (session: Session, tandem: Tandem) => {
        history.push('show-session', { session, tandem });
    };

    return (
        <IonContent>
            <SessionFormContent
                goBack={goBack}
                isHybrid
                profile={profile}
                tandem={tandem}
                session={session}
                onShowSessionPressed={onShowSessionPressed}
            />
        </IonContent>
    );
};

export default UpdateSessionPage;
