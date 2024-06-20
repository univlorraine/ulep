import { Message } from '../../../domain/entities/chat/Message';
import styles from './MessageText.module.css';

interface MessageTextProps {
    message: Message;
    isCurrentUserMessage: boolean;
}

const MessageText: React.FC<MessageTextProps> = ({ message, isCurrentUserMessage }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return <div className={`${styles.message} ${messageClass}`}>{message.content}</div>;
};

export default MessageText;
