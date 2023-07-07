import { IonPage } from '@ionic/react';
import WebLayout from '../components/WebLayout';
import WelcomeContent from '../components/contents/WelcomeContent';
import ResetPasswordForm from '../components/forms/ResetPasswordForm';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const ResetPasswordPage: React.FC = () => {
    const { width } = useWindowDimensions();
    return (
        <IonPage>
            {width < HYBRID_MAX_WIDTH ? (
                <ResetPasswordForm />
            ) : (
                <WebLayout leftComponent={<WelcomeContent />} rightComponent={<ResetPasswordForm />} />
            )}
        </IonPage>
    );
};

export default ResetPasswordPage;
