import { Redirect } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import { IonContent, IonPage } from '@ionic/react';

const ConversationsPage: React.FC = () => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <IonPage>
                <IonContent>Conversations</IonContent>
            </IonPage>
        );
    }

    return (
        <OnlineWebLayout profile={profile}>
            <IonPage>
                <IonContent>Conversations</IonContent>
            </IonPage>
        </OnlineWebLayout>
    );
};

export default ConversationsPage;
