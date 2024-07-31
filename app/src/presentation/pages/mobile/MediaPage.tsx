import { IonContent } from '@ionic/react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Conversation from '../../../domain/entities/chat/Conversation';
import { useStoreState } from '../../../store/storeTypes';
import MediaContent from '../../components/contents/MediaContent';

interface MediaPageProps {
    conversation: Conversation;
}

const MediaPage = () => {
    const history = useHistory();
    const location = useLocation<MediaPageProps>();
    const { conversation } = location.state;
    const profile = useStoreState((state) => state.profile);

    if (!conversation) {
        return <Redirect to="/conversations" />;
    }

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/chat', { conversation });
    };

    return (
        <IonContent>
            <MediaContent conversation={conversation} goBack={goBack} profile={profile} isHybrid />
        </IonContent>
    );
};

export default MediaPage;
