import { IonList } from '@ionic/react';
import Conversation from '../../../domain/entities/chat/Conversation';
import ConversationLine from './ConversationLine';
import styles from './ConversationsLines.module.css';

interface ConversationsLinesProps {
    conversations: Conversation[];
    userId: string;
    onConversationPressed: (conversation: Conversation) => void;
}

const ConversationsLines: React.FC<ConversationsLinesProps> = ({ conversations, onConversationPressed, userId }) => {
    return (
        <IonList inset={true} className={styles.container}>
            {conversations.map((conversation) => (
                <ConversationLine
                    key={conversation.id}
                    conversation={conversation}
                    onPressed={onConversationPressed}
                    userId={userId}
                />
            ))}
        </IonList>
    );
};

export default ConversationsLines;
