import { IonPage } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import EndSessionContent from '../../components/contents/EndSessionContent';

const EndSessionPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<{
        learningLanguageId: string;
        duration: number;
        partnerTandemId: string;
        tandemFirstname: string;
        tandemLastname: string;
    }>();
    const { learningLanguageId, duration, partnerTandemId, tandemFirstname, tandemLastname } = location.state;

    const onCompleteLearningJournalPressed = () => {
        history.push('/home');
    };

    return (
        <IonPage>
            <EndSessionContent
                learningLanguageId={learningLanguageId}
                duration={duration}
                partnerTandemId={partnerTandemId}
                tandemFirstname={tandemFirstname}
                tandemLastname={tandemLastname}
                onClose={() => history.push('/home')}
                onCompleteLearningJournalPressed={onCompleteLearningJournalPressed}
            />
        </IonPage>
    );
};

export default EndSessionPage;
