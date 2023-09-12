import { IonPage } from '@ionic/react';
import { useParams } from 'react-router';
import WelcomeContent from '../components/contents/WelcomeContent';
import ResetPasswordForm from '../components/forms/ResetPasswordForm';
import WebLayout from '../components/layout/WebLayout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

type RouteParams = {
    id: string;
};

const ResetPasswordPage: React.FC = () => {
    const { width } = useWindowDimensions();
    const { id } = useParams<RouteParams>();
    return (
        <IonPage>
            {width < HYBRID_MAX_WIDTH ? (
                <ResetPasswordForm id={id} />
            ) : (
                <WebLayout leftComponent={<WelcomeContent />} rightComponent={<ResetPasswordForm id={id} />} />
            )}
        </IonPage>
    );
};

export default ResetPasswordPage;
