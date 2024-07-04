import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import Conversation from '../../domain/entities/chat/Conversation';
import { useStoreState } from '../../store/storeTypes';
import ChatContent from '../components/contents/ChatContent';
import ConversationsContent from '../components/contents/ConversationsContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import useGetConversations from '../hooks/useGetConversations';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import styles from './css/ConversationsPage.module.css';

interface ConversationsPageParams {
    tandemId: string;
}

const ConversationsPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation<ConversationsPageParams>();
    const { tandemId } = location.state || {};
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>();

    const { conversations, error, isLoading } = useGetConversations();

    useEffect(() => {
        if (tandemId && !currentConversation) {
            const conversation = conversations.find((conversation) => conversation.id === tandemId);
            setCurrentConversation(conversation);
        }
    }, [conversations]);

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
                <div className={styles.conversationContent}>
                    <ConversationsContent
                        conversations={conversations}
                        profile={profile}
                        isHybrid={isHybrid}
                        isLoading={isLoading}
                        onConversationPressed={(conversation) => setCurrentConversation(conversation)}
                    />
                </div>
                {currentConversation && (
                    <div className={styles.chatContent}>
                        <ChatContent conversation={currentConversation} profile={profile} isHybrid={isHybrid} />
                    </div>
                )}
            </div>
        </OnlineWebLayout>
    );
};

export default ConversationsPage;
