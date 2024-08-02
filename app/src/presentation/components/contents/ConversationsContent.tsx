import { IonPage } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Conversation from '../../../domain/entities/chat/Conversation';
import Profile from '../../../domain/entities/Profile';
import ConversationsLines from '../chat/ConversationsLines';
import Loader from '../Loader';
import styles from './ConversationsContent.module.css';

interface ConversationsContentProps {
    conversations: Conversation[];
    isHybrid: boolean;
    isLoading: boolean;
    profile: Profile;
    onConversationPressed: (conversation: Conversation) => void;
}

const Content: React.FC<Omit<ConversationsContentProps, 'isHybrid'>> = ({
    conversations,
    isLoading,
    onConversationPressed,
    profile,
}) => {
    const { t } = useTranslation();

    return (
        <div className={`${styles.container}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('conversations.title')}</h1>
            </div>
            {!isLoading && (
                <ConversationsLines
                    conversations={conversations}
                    onConversationPressed={onConversationPressed}
                    userId={profile.user.id}
                />
            )}
            {isLoading && <Loader />}
        </div>
    );
};

const ConversationsContent: React.FC<ConversationsContentProps> = ({
    conversations,
    isHybrid,
    isLoading,
    onConversationPressed,
    profile,
}) => {
    if (!isHybrid) {
        return (
            <Content
                conversations={conversations}
                isLoading={isLoading}
                onConversationPressed={onConversationPressed}
                profile={profile}
            />
        );
    }

    return (
        <IonPage className={styles.content}>
            <Content
                conversations={conversations}
                isLoading={isLoading}
                onConversationPressed={onConversationPressed}
                profile={profile}
            />
        </IonPage>
    );
};

export default ConversationsContent;
