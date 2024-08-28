import { IonPage } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Tandem from '../../../domain/entities/Tandem';
import TandemProfile from '../../components/tandems/TandemProfile';

interface TandemProfilePageState {
    tandem: Tandem;
}

const TandemProfilePage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<TandemProfilePageState>();
    const { tandem } = location.state || {};

    if (!tandem.partner || !tandem.learningLanguage) {
        return <Redirect to="/home" />;
    }
    return (
        <IonPage>
            <TandemProfile
                id={tandem.id}
                language={tandem.learningLanguage}
                level={tandem.level}
                onClose={() => history.push('/home')}
                partnerLearningLanguage={tandem.partnerLearningLanguage}
                pedagogy={tandem.pedagogy}
                profile={tandem.partner}
            />
        </IonPage>
    );
};

export default TandemProfilePage;
