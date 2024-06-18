import Conversation from '../../../domain/entities/chat/Conversation';
import ConversationLine from './ConversationLine';
import styles from './ConversationsLines.module.css';

interface ConversationsLinesProps {
    conversations: Conversation[];
    userId: string;
}

const ConversationsLines: React.FC<ConversationsLinesProps> = ({ conversations, userId }) => {
    return (
        <div className={styles.container}>
            {conversations.map((conversation) => (
                <ConversationLine key={conversation.id} conversation={conversation} userId={userId} />
            ))}
        </div>
    );
};

export default ConversationsLines;
