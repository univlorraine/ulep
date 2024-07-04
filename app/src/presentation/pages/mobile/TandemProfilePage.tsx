import { IonPage } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import TandemProfile from '../../components/tandems/TandemProfile';

interface TandemProfileState {
    id: string;
    language: Language;
    pedagogy: Pedagogy;
    profile: Profile;
    level: CEFR;
    tandemLearningLanguage: Language;
}

const TandemProfilePage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<TandemProfileState>();
    const { id, language, level, pedagogy, profile, tandemLearningLanguage } = location.state || {};

    if (!profile || !language) {
        return <Redirect to="/home" />;
    }
    return (
        <IonPage>
            <TandemProfile
                id={id}
                language={language}
                level={level}
                onClose={() => history.push('/home')}
                partnerLearningLanguage={tandemLearningLanguage}
                pedagogy={pedagogy}
                profile={profile}
            />
        </IonPage>
    );
};

export default TandemProfilePage;
