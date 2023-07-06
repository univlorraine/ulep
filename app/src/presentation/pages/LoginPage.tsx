import { IonCol, IonPage, IonRow, isPlatform } from '@ionic/react';
import WelcomeContent from '../components/contents/WelcomeContent';
import LoginForm from '../components/forms/LoginForm';

const LoginPage: React.FC = () => {
    return (
        <IonPage>
            {isPlatform('hybrid') ? (
                <LoginForm />
            ) : (
                <IonRow className="no-gutters" style={{ height: '100%' }}>
                    <IonCol size="6">
                        <WelcomeContent />
                    </IonCol>
                    <IonCol size="6">
                        <LoginForm />
                    </IonCol>
                </IonRow>
            )}
        </IonPage>
    );
};

export default LoginPage;
