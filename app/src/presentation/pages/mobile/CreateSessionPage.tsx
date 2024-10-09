import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreState } from '../../../store/storeTypes';
import SessionFormContent from '../../components/contents/SessionFormContent';
import Session from '../../../domain/entities/Session';

interface CreateSessionPageProps {
    tandem: Tandem;
}

const CreateSessionPage = () => {
    const history = useHistory();
    const location = useLocation<CreateSessionPageProps>();
    const { tandem } = location.state;
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.goBack();
    };

    const onShowSessionPressed = (session: Session, tandem: Tandem, confirmCreation?: boolean) => {
        history.push('show-session', { session, tandem, confirmCreation });
    };

    return (
        <IonContent>
            <SessionFormContent
                goBack={goBack}
                isHybrid
                profile={profile}
                tandem={tandem}
                onShowSessionPressed={onShowSessionPressed}
            />
        </IonContent>
    );
};

export default CreateSessionPage;
