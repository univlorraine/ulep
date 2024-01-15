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
    tandemLearningLanguage: Language;
}

const TandemProfilePage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<TandemProfileState>();
    const { language, level, pedagogy, profile, tandemLearningLanguage } = location.state || {};

    if (!profile || !language) {
        return <Redirect to="/home" />;
    }
    return (
        <IonPage>
            <TandemProfile language={language} level={level} onClose={() => history.push('/home')} partnerLearningLanguage={tandemLearningLanguage} pedagogy={pedagogy} profile={profile} />
        </IonPage>
    );
};

export default TandemProfilePage;
