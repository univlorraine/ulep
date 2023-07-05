import { IonCol, IonPage, IonRow, isPlatform } from '@ionic/react';
import { useHistory } from 'react-router';
import ConnexionContent from '../components/ConnectionContent';
import WelcomeContent from '../components/WelcomeContent';

const HomePage: React.FC = () => {
    const history = useHistory();
    return (
        <IonPage>
            {isPlatform('hybrid') ? (
                <WelcomeContent onPress={() => history.push('/connect')} />
            ) : (
                <IonRow className="no-gutters">
                    <IonCol size="6">
                        <WelcomeContent />
                    </IonCol>
                    <IonCol size="6">
                        <ConnexionContent
                            onLoginPressed={() => history.push('/login')}
                            onSignUpPressed={() => history.push('/login')}
                        />
                    </IonCol>
                </IonRow>
            )}
        </IonPage>
    );
};

export default HomePage;
