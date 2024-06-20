import { useTranslation } from 'react-i18next';
import { Message } from '../../../domain/entities/chat/Message';
import styles from './MessageText.module.css';

interface MessageTextProps {
    message: Message;
    isCurrentUserMessage: boolean;
}

const MessageText: React.FC<MessageTextProps> = ({ message, isCurrentUserMessage }) => {
    const { t } = useTranslation();
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;
    const headerClass = isCurrentUserMessage ? styles.alignRight : styles.alignLeft;
    const name = isCurrentUserMessage ? t('chat.me') : `${message.sender.firstname} ${message.sender.lastname}`;
    const date = `${t(message.getMessageDate())} ${message.getMessageHour()}`;

    return (
        <div className={styles.messageContainer}>
            <div className={`${styles.header} ${headerClass}`}>
                <span className={styles.name}>{name}</span>
                <span className={styles.date}>{date}</span>
            </div>
            <div className={`${styles.message} ${messageClass}`}>{message.content}</div>
        </div>
    );
};

export default MessageText;
