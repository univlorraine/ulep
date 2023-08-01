import { IonPage } from '@ionic/react';
import WelcomeContent from '../components/contents/WelcomeContent';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';
import WebLayout from '../components/layout/WebLayout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const ForgotPasswordPage: React.FC = () => {
    const { width } = useWindowDimensions();
    return (
        <IonPage>
            {width < HYBRID_MAX_WIDTH ? (
                <ForgotPasswordForm />
            ) : (
                <WebLayout leftComponent={<WelcomeContent />} rightComponent={<ForgotPasswordForm />} />
            )}
        </IonPage>
    );
};

export default ForgotPasswordPage;
