import { IonPage } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import TandemProfile from '../../components/tandems/TandemProfile';

interface TandemProfileState {
    language: Language;
    pedagogy: Pedagogy;
    profile: Profile;
    level: CEFR;
}

const TandemProfilePage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<TandemProfileState>();
    const { language, level, pedagogy, profile } = location.state || {};

    if (!profile || !language) {
        return <Redirect to="/home" />;
    }
    return (
        <IonPage>
            <TandemProfile language={language} level={level} onClose={() => history.push('/home')} pedagogy={pedagogy} profile={profile} />
        </IonPage>
    );
};

export default TandemProfilePage;
