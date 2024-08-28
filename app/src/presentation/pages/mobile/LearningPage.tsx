import { IonContent } from '@ionic/react';
import { Redirect } from 'react-router';
import { useStoreState } from '../../../store/storeTypes';

const LearningPage = () => {
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    return <IonContent />;
};

export default LearningPage;
