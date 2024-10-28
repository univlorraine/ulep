import { IonContent } from '@ionic/react';
import { Redirect, useHistory } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import ReportsContent from '../components/contents/ReportsContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const ReportsPage: React.FC = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <IonContent>
                <ReportsContent goBack={history.goBack} />
            </IonContent>
        );
    }

    return (
        <OnlineWebLayout profile={profile}>
            <ReportsContent goBack={history.goBack} />
        </OnlineWebLayout>
    );
};

export default ReportsPage;
