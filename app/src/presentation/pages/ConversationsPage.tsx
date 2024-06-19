import { Redirect, useHistory } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import { useIonToast } from '@ionic/react';
import useGetConversations from '../hooks/useGetConversations';
import { useTranslation } from 'react-i18next';
import ConversationsContent from '../components/contents/ConversationsContent';

const ConversationsPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);

    const { conversations, error, isLoading } = useGetConversations();

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <ConversationsContent
                conversations={conversations}
                profile={profile}
                isLoading={isLoading}
                onConversationPressed={(conversation) => history.push(`/chat`, { conversation })}
            />
        );
    }

    return (
        <OnlineWebLayout profile={profile}>
            <ConversationsContent
                conversations={conversations}
                profile={profile}
                isLoading={isLoading}
                onConversationPressed={() => {}}
            />
        </OnlineWebLayout>
    );
};

export default ConversationsPage;
