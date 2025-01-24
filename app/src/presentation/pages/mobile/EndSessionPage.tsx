import { IonPage } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import Tandem from '../../../domain/entities/Tandem';
import EndSessionContent from '../../components/contents/EndSessionContent';

const EndSessionPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<{
        tandem: Tandem;
    }>();
    const onCompleteLearningJournalPressed = () => {
        history.push('learning-book', { tandem: location.state.tandem, openNewEntry: true });
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
