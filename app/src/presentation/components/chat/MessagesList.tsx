import { isSameDay } from 'date-fns';
import { Message } from '../../../domain/entities/chat/Message';
import MessageText from './MessageText';
import styles from './MessagesList.module.css';
import { useTranslation } from 'react-i18next';

interface MessagesListProps {
    messages: Message[];
    loadMessages: () => void;
    userId: string;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, loadMessages, userId }) => {
    const { t } = useTranslation();
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = event.currentTarget;

        if (scrollTop < 200) {
            console.log('Chargement des messages');
        }
    };

    const renderMessages = () => {
        const messageElements: React.ReactNode[] = [];
        let lastDate: Date | null = null;

        messages.forEach((message, index) => {
            const messageDate = new Date(message.createdAt);
            const isCurrentUserMessage = message.isMine(userId);

            if (!lastDate || !isSameDay(lastDate, messageDate)) {
                messageElements.push(
                    <div key={`date-${index}`} className={styles.dateSeparator}>
                        {t(message.getMessageDate())}
                    </div>
                );
                lastDate = messageDate;
            }

            messageElements.push(
                <div key={index} className={isCurrentUserMessage ? styles.currentUser : styles.otherUser}>
                    <MessageText message={message} isCurrentUserMessage={isCurrentUserMessage} />
                </div>
            );
        });

        return messageElements;
    };

    return (
        <div className={styles.messages} onScroll={handleScroll}>
            {renderMessages()}
        </div>
    );
};

export default MessagesList;
