import { isSameDay } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../../../domain/entities/chat/Message';
import Loader from '../Loader';
import MessageText from './MessageText';
import styles from './MessagesList.module.css';

interface MessagesListProps {
    messages: Message[];
    isScrollOver: boolean;
    loadMessages: () => void;
    userId: string;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, isScrollOver, loadMessages, userId }) => {
    const { t } = useTranslation();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    };

    useEffect(() => {
        const messagesContainer = messagesEndRef.current?.parentElement;
        // Check if every messages are visible, if yes, load more messages
        if (messagesContainer && messagesContainer.scrollHeight <= messagesContainer.clientHeight) {
            loadMessages();
            // Scroll to bottom if there is more message than the container height
        } else if (!isLoading) {
            scrollToBottom();
            // Set loading to false if there is more message loaded
        } else {
            setIsLoading(false);
        }
    }, [messages]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = event.currentTarget;

        if (!isLoading && !isScrollOver && scrollTop < 200) {
            setIsLoading(true);
            loadMessages();
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
                    <div key={`id-${message.id}`} className={styles.dateSeparator}>
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
            {isLoading && (
                <div className={styles.loader}>
                    <Loader color="#FFF" height={30} width={30} />
                </div>
            )}
            {renderMessages()}
        </div>
    );
};

export default MessagesList;
