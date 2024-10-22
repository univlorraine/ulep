import { IonPage } from '@ionic/react';
import { Redirect, useHistory } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import ProfileContent from '../components/contents/ProfileContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const ProfilePage: React.FC = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    if (!profile) {
        return <Redirect to={'/signup'} />;
    }

    if (isHybrid) {
        return (
            <IonPage>
                <ProfileContent onParameterPressed={() => history.push('/settings')} profile={profile} />
            </IonPage>
        );
    }

    return (
        <OnlineWebLayout profile={profile}>
            <ProfileContent onParameterPressed={() => history.push('/settings')} profile={profile} />
        </OnlineWebLayout>
    );
};

export default ProfilePage;
