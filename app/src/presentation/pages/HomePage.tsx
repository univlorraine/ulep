import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import WebLayout from '../components/WebLayout';
import ConnexionContent from '../components/contents/ConnectionContent';
import WelcomeContent from '../components/contents/WelcomeContent';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const HomePage: React.FC = () => {
    const history = useHistory();
    const { width } = useWindowDimensions();
    return (
        <IonPage>
            {width < HYBRID_MAX_WIDTH ? (
                <WelcomeContent onPress={() => history.push('/connect')} />
            ) : (
                <WebLayout
                    leftComponent={<WelcomeContent />}
                    rightComponent={
                        <ConnexionContent
                            onLoginPressed={() => history.push('/login')}
                            onSignUpPressed={() => history.push('/login')}
                        />
                    }
                />
            )}
        </IonPage>
    );
};

export default HomePage;
