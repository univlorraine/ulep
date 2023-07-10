import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import ConnexionContent from '../components/contents/ConnectionContent';

const ConnectPage: React.FC = () => {
    const history = useHistory();
    return (
        <IonPage>
            <ConnexionContent
                onLoginPressed={() => history.push('/login')}
                onSignUpPressed={() => history.push('/signup')}
            />
        </IonPage>
    );
};

export default ConnectPage;
