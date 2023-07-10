import { IonPage } from '@ionic/react';
import WebLayout from '../components/WebLayout';
import WelcomeContent from '../components/contents/WelcomeContent';
import LoginForm from '../components/forms/LoginForm';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import { useHistory } from 'react-router';

const LoginPage: React.FC = () => {
    const { width } = useWindowDimensions();
    const history = useHistory();
    return (
        <IonPage>
            {width < HYBRID_MAX_WIDTH ? (
                <LoginForm goBack={() => history.push('/connect')} />
            ) : (
                <WebLayout leftComponent={<WelcomeContent />} rightComponent={<LoginForm goBack={() => history.push('/')} />} />
            )}
        </IonPage>
    );
};

export default LoginPage;
