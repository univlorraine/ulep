import { IonContent } from '@ionic/react';
import { Redirect } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const HomePage: React.FC = () => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return <IonContent />;
    }

    return (
        <>
            <OnlineWebLayout profile={profile}>
                <IonContent />
            </OnlineWebLayout>
        </>
    );
};

export default HomePage;
