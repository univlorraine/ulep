import { IonPage } from '@ionic/react';
import WebLayout from '../components/WebLayout';
import WelcomeContent from '../components/contents/WelcomeContent';
import LoginForm from '../components/forms/LoginForm';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const LoginPage: React.FC = () => {
    const { width } = useWindowDimensions();
    return (
        <IonPage>
            {width < HYBRID_MAX_WIDTH ? (
                <LoginForm />
            ) : (
                <WebLayout leftComponent={<WelcomeContent />} rightComponent={<LoginForm />} />
            )}
        </IonPage>
    );
};

export default LoginPage;
