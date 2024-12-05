import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useStoreState } from '../../../store/storeTypes';
import FlipcardsContent from '../../components/contents/FlipcardsContent';

type FlipcardsPageProps = {
    selectedListsId: string[];
    learningLanguageId: string;
};

const FlipcardsPage = () => {
    const history = useHistory();
    const location = useLocation<FlipcardsPageProps>();
    const profile = useStoreState((state) => state.profile);
    const { selectedListsId, learningLanguageId } = location.state;

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    return (
        <IonContent>
            <FlipcardsContent
                learningLanguageId={learningLanguageId}
                profile={profile}
                selectedListsId={selectedListsId}
                onBackPressed={() => history.goBack()}
            />
        </IonContent>
    );
};

export default FlipcardsPage;
