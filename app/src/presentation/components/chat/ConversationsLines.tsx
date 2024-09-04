import { IonList, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Conversation from '../../../domain/entities/chat/Conversation';
import ConversationLine from './ConversationLine';
import styles from './ConversationsLines.module.css';

interface ConversationsLinesProps {
    conversations: Conversation[];
    userId: string;
    onConversationPressed: (conversation: Conversation) => void;
    currentConversation?: Conversation;
}

const ConversationsLines: React.FC<ConversationsLinesProps> = ({
    conversations,
    onConversationPressed,
    userId,
    currentConversation,
}) => {
    const { t } = useTranslation();
    return (
        <IonList
            lines="full"
            className={styles.container}
            aria-label={t('chat.conversation_menu.conversation_aria_label') as string}
        >
            {conversations.length > 0 ? (
                conversations.map((conversation) => (
                    <ConversationLine
                        key={conversation.id}
                        conversation={conversation}
                        onPressed={onConversationPressed}
                        userId={userId}
                        currentConversation={currentConversation}
                    />
                ))
            ) : (
                <IonText className={styles.no_conversations}>{t('chat.no_conversations')}</IonText>
            )}
        </IonList>
    );
};

export default ConversationsLines;
