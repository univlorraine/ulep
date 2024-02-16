import { IonPage } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import ConnexionContent from '../components/contents/ConnectionContent';
import WelcomeContent from '../components/contents/WelcomeContent';
import WebLayout from '../components/layout/WebLayout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import { useEffect } from 'react';
import { useStoreState } from '../../store/storeTypes';

const WelcomePage: React.FC = () => {
    const history = useHistory();
    const { width } = useWindowDimensions();
    const location = useLocation();
    const token = useStoreState((state) => state.accessToken);

    if (token) window.location.href = '/home';

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (width < HYBRID_MAX_WIDTH && location.pathname === '/') {
            timeout = setTimeout(() => history.push('/connect'), 5000);
        }
        return () => clearTimeout(timeout);
    }, [location.pathname]);

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
                            onSignUpPressed={() => history.push('/signup')}
                        />
                    }
                />
            )}
        </IonPage>
    );
};

export default WelcomePage;
