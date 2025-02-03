import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreState } from '../../../store/storeTypes';
import LearningBookContainerContent from '../../components/contents/learning-book/LearningBookContainerContent';

interface LearningBookPageState {
    tandem: Tandem;
    openNewEntry?: boolean;
}

const LearningBookPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<LearningBookPageState>();
    const { tandem } = location.state || {};
    const profile = useStoreState((state) => state.profile);

    if (!tandem || !profile) {
        return <Redirect to="/home" />;
    }

    return (
        <IonContent>
            <div style={{ color: 'black' }}>
                <LearningBookContainerContent
                    onClose={() => history.goBack()}
                    onOpenVocabularyList={(currentVocabularyListId) =>
                        history.push('vocabularies', { tandem, currentVocabularyListId })
                    }
                    onOpenActivity={(activityId) => history.push('activities', { tandem, activityId })}
                    profile={profile}
                    learningLanguage={tandem.learningLanguage}
                    openNewEntry={location.state?.openNewEntry}
                />
            </div>
        </IonContent>
    );
};

export default LearningBookPage;
