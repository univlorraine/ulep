import { IonPage } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Tandem from '../../../domain/entities/Tandem';
import TandemStatusContent from '../../components/contents/TandemStatusContent';

interface TandemStatusPageState {
    tandem: Tandem;
}

const TandemStatusPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<TandemStatusPageState>();
    const { tandem } = location.state || {};

    if (!tandem) {
        return <Redirect to="/home" />;
    }

    return (
        <IonPage>
            <TandemStatusContent onFindNewTandem={() => null} onClose={history.goBack} status={tandem.status} />
        </IonPage>
    );
};

export default TandemStatusPage;
