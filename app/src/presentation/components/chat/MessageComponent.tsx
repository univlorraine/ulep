import { useTranslation } from 'react-i18next';
import { Message } from '../../../domain/entities/chat/Message';
import AudioLine from '../AudioLine';
import styles from './MessageComponent.module.css';

interface MessageProps {
    message: Message;
    isCurrentUserMessage: boolean;
}

const MessageComponent: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const { t } = useTranslation();
    const headerClass = isCurrentUserMessage ? styles.alignRight : styles.alignLeft;
    const name = isCurrentUserMessage ? t('chat.me') : `${message.sender.firstname} ${message.sender.lastname}`;
    const date = `${t(message.getMessageDate())} ${message.getMessageHour()}`;

    const renderMessageContent = () => {
        switch (message.type) {
            case 'text':
                return <MessageText message={message} isCurrentUserMessage={isCurrentUserMessage} />;
            case 'image':
                return <MessageImage message={message} isCurrentUserMessage={isCurrentUserMessage} />;
            case 'audio':
                return <MessageAudio message={message} isCurrentUserMessage={isCurrentUserMessage} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.messageContainer}>
            <div className={`${styles.header} ${headerClass}`}>
                <span className={styles.name}>{name}</span>
                <span className={styles.date}>{date}</span>
            </div>
            {renderMessageContent()}
        </div>
    );
};

const MessageText: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return <div className={`${styles.message} ${messageClass}`}>{message.content}</div>;
};

const MessageImage: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return (
        <div className={`${styles.messageImage} ${messageClass}`}>
            <img className={styles.image} src={message.content} />
        </div>
    );
};

const MessageAudio: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return (
        <div className={`${styles.messageAudio} ${messageClass}`}>
            <AudioLine audioFile={message.content} />
        </div>
    );
};

export default MessageComponent;
