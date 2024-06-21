import { isSameDay } from 'date-fns';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../../../domain/entities/chat/Message';
import MessageText from './MessageText';
import styles from './MessagesList.module.css';

interface MessagesListProps {
    messages: Message[];
    loadMessages: () => void;
    userId: string;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, loadMessages, userId }) => {
    const { t } = useTranslation();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    };

    // On mount, scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = event.currentTarget;

        if (scrollTop < 200) {
            console.log('Chargement des messages');
        }
    };

    const renderMessages = () => {
        const messageElements: React.ReactNode[] = [];
        let lastDate: Date | null = null;

        const reversedMessages = [...messages].reverse();

        reversedMessages.forEach((message, index) => {
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

        messageElements.push(<div ref={messagesEndRef} />);

        return messageElements;
    };

    return (
        <div className={styles.messages} onScroll={handleScroll}>
            {renderMessages()}
        </div>
    );
};

export default MessagesList;
