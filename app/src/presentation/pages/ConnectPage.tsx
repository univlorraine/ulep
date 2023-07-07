import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import ConnexionContent from '../components/ConnectionContent';

const ConnectPage: React.FC = () => {
    const history = useHistory();
    return (
        <IonPage>
            <ConnexionContent
                onLoginPressed={() => history.push('/login')}
                onSignUpPressed={() => history.push('/login')}
            />
        </IonPage>
    );
};

export default ConnectPage;
