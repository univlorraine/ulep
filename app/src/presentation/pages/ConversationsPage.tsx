import { IonContent, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import Conversation from '../../domain/entities/chat/Conversation';
import { useStoreState } from '../../store/storeTypes';
import ChatContent from '../components/contents/ChatContent';
import ConversationsContent from '../components/contents/ConversationsContent';
import MediaContent from '../components/contents/MediaContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import useGetConversations from '../hooks/useGetConversations';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import styles from './css/ConversationsPage.module.css';

interface ConversationsPageParams {
    tandemId: string;
    conversation: Conversation | undefined;
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
    const [currentConversation, setCurrentConversation] = useState<Conversation | undefined>();
    const [currentContent, setCurrentContent] = useState<string>('chat');

    const { conversations, error, isLoading } = useGetConversations();

    useEffect(() => {
        if (tandemId && !currentConversation) {
            setCurrentConversation(conversations.find((conversation) => conversation.id === tandemId));
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
            <IonContent>
                <ConversationsContent
                    conversations={conversations}
                    profile={profile}
                    isHybrid={isHybrid}
                    isLoading={isLoading}
                    onConversationPressed={(conversation) => history.push(`/chat`, { conversation })}
                />
            </IonContent>
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
                        currentConversation={currentConversation}
                    />
                </div>
                {currentConversation && (
                    <div className={styles.chatContent}>
                        {currentContent === 'chat' && (
                            <ChatContent
                                conversation={currentConversation}
                                profile={profile}
                                isHybrid={isHybrid}
                                setCurrentContent={setCurrentContent}
                            />
                        )}
                        {currentContent === 'media' && (
                            <MediaContent
                                conversation={currentConversation}
                                profile={profile}
                                isHybrid={isHybrid}
                                goBack={() => setCurrentContent('chat')}
                            />
                        )}
                    </div>
                )}
            </div>
        </OnlineWebLayout>
    );
};

export default ConversationsPage;
