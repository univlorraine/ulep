import { IonPage } from '@ionic/react';
import './Home.css';
import WelcomeContent from '../components/WelcomeContent';

const Home: React.FC = () => {
    return (
        <IonPage>
            <WelcomeContent />
        </IonPage>
    );
};

export default Home;
