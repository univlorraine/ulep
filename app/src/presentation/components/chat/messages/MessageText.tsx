import { MessageProps } from '../MessageComponent';
import styles from '../MessageComponent.module.css';
import LikeButton from './LikeButton';

const MessageText: React.FC<MessageProps> = ({ message, isCurrentUserMessage, currentMessageSearchId }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return (
        <div
            className={`${styles.message} ${messageClass} ${
                message.id === currentMessageSearchId ? styles.searchMessage : ''
            }`}
        >
            {message.content}
            <LikeButton message={message} isCurrentUserMessage={isCurrentUserMessage} />
        </div>
    );
};

export default MessageText;
