import { IonHeader, IonPage } from '@ionic/react';
import ProgressBar from '../components/ProgressBar';

const SignUpPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <ProgressBar color="#FDEE66" percentage={5} />
            </IonHeader>
        </IonPage>
    );
};

export default SignUpPage;
