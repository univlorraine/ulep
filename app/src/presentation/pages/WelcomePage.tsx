import { IonContent, IonPage } from '@ionic/react';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import ConnexionContent from '../components/contents/ConnectionContent';
import WelcomeContent from '../components/contents/WelcomeContent';
import WebLayout from '../components/layout/WebLayout';
import useRedirectToHomeIfLogged from '../hooks/useRedirectToHomeIfLogged';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const WelcomePage: React.FC = () => {
    const history = useHistory();
    const { width } = useWindowDimensions();
    const location = useLocation();
    useRedirectToHomeIfLogged();

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (width < HYBRID_MAX_WIDTH && location.pathname === '/') {
            timeout = setTimeout(() => history.push('/connect'), 5000);
        }
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    return (
        <IonPage>
            <IonContent>
                {width < HYBRID_MAX_WIDTH ? (
                    <WelcomeContent onPress={() => history.push('/connect')} />
                ) : (
                    <WebLayout
                        leftComponent={<WelcomeContent />}
                        rightComponent={
                            <ConnexionContent
                                onLoginPressed={() => history.push('/login')}
                                onSignUpPressed={() => history.push('/signup')}
                            />
                        }
                    />
                )}
            </IonContent>
        </IonPage>
    );
};

export default WelcomePage;
