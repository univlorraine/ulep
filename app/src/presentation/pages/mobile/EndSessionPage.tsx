import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import EndSessionContent from '../../components/contents/EndSessionContent';

const EndSessionPage: React.FC = () => {
    const history = useHistory();

    const onCompleteLearningJournalPressed = () => {
        history.push('/learning-journal');
    };

    return (
        <IonPage>
            <EndSessionContent
                onClose={() => history.push('/home')}
                onCompleteLearningJournalPressed={onCompleteLearningJournalPressed}
            />
        </IonPage>
    );
};

export default EndSessionPage;
