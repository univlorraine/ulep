import { Message } from '../../../domain/entities/chat/Message';
import MessageText from './MessageText';
import styles from './MessagesList.module.css';

interface MessagesListProps {
    messages: Message[];
    loadMessages: () => void;
    userId: string;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, loadMessages, userId }) => {
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = event.currentTarget;

        if (scrollTop < 200) {
            console.log('Chargement des messages');
        }
    };

    return (
        <div className={styles.messages} onScroll={handleScroll}>
            {messages.map((message, index) => {
                const isCurrentUserMessage = message.isMine(userId);
                return (
                    <div key={index} className={isCurrentUserMessage ? styles.currentUser : styles.otherUser}>
                        <MessageText message={message} isCurrentUserMessage={message.isMine(userId)} />
                    </div>
                );
            })}
        </div>
    );
};

export default MessagesList;
