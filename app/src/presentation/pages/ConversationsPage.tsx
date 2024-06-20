import { Redirect, useHistory } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import { useIonToast } from '@ionic/react';
import useGetConversations from '../hooks/useGetConversations';
import { useTranslation } from 'react-i18next';
import ConversationsContent from '../components/contents/ConversationsContent';
import { useState } from 'react';
import Conversation from '../../domain/entities/chat/Conversation';
import ChatContent from '../components/contents/ChatContent';
import styles from './css/ConversationsPage.module.css';

const ConversationsPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

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
                isHybrid={isHybrid}
                isLoading={isLoading}
                onConversationPressed={(conversation) => history.push(`/chat`, { conversation })}
            />
        );
    }

    return (
        <OnlineWebLayout profile={profile}>
            <div className={styles.container}>
                <ConversationsContent
                    conversations={conversations}
                    profile={profile}
                    isHybrid={isHybrid}
                    isLoading={isLoading}
                    onConversationPressed={(conversation) => setCurrentConversation(conversation)}
                />
                {currentConversation && (
                    <ChatContent conversation={currentConversation} userId={profile.user.id} isHybrid={isHybrid} />
                )}
            </div>
        </OnlineWebLayout>
    );
};

export default ConversationsPage;
