import { IonContent } from '@ionic/react';
import { Redirect, useHistory } from 'react-router';
import { useStoreState } from '../../../store/storeTypes';
import ActivitiesContent from '../../components/contents/activity/ActivitiesContent';

const ActivitiesPage = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/learning');
    };

    return (
        <>
            <IonContent>
                <ActivitiesContent onAddActivity={() => {}} onBackPressed={goBack} />
            </IonContent>
        </>
    );
};

export default ActivitiesPage;
