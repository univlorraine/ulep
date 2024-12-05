import { IonPage } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import EndSessionContent from '../../components/contents/EndSessionContent';

const EndSessionPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<{ learningLanguageId: string }>();
    const { learningLanguageId } = location.state;

    const onCompleteLearningJournalPressed = () => {
        history.push('/learning-journal');
    };

    return (
        <IonPage>
            <EndSessionContent
                learningLanguageId={learningLanguageId}
                onClose={() => history.push('/home')}
                onCompleteLearningJournalPressed={onCompleteLearningJournalPressed}
            />
        </IonPage>
    );
};

export default EndSessionPage;
