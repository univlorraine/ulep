import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import WelcomeContent from '../components/contents/WelcomeContent';
import LoginForm from '../components/forms/LoginForm';
import WebLayout from '../components/layout/WebLayout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const LoginPage: React.FC = () => {
    const { width } = useWindowDimensions();
    const history = useHistory();
    return (
        <IonPage>
            {width < HYBRID_MAX_WIDTH ? (
                <LoginForm goBack={() => history.push('/connect')} />
            ) : (
                <WebLayout
                    leftComponent={<WelcomeContent />}
                    rightComponent={<LoginForm goBack={() => history.push('/')} />}
                />
            )}
        </IonPage>
    );
};

export default LoginPage;
