import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreState } from '../../../store/storeTypes';
import VocabularyContent from '../../components/contents/VocabularyContent';

interface VocabulariesPageProps {
    tandem?: Tandem;
    currentVocabularyListId?: string;
}

const VocabulariesPage = () => {
    const history = useHistory();
    const location = useLocation<VocabulariesPageProps>();
    const { tandem, currentVocabularyListId } = location.state || {};
    const profile = useStoreState((state) => state.profile);

    if (!profile || !tandem) {
        return <Redirect to="/" />;
    }

    return (
        <IonContent>
            <VocabularyContent
                profile={profile}
                onClose={() => history.push('learning', { tandem })}
                currentLearningLanguage={tandem.learningLanguage}
                currentVocabularyListId={currentVocabularyListId}
            />
        </IonContent>
    );
};

export default VocabulariesPage;
