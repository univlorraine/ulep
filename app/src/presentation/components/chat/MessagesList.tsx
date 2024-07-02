import { isSameDay } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../../../domain/entities/chat/Message';
import Loader from '../Loader';
import MessageComponent from './MessageComponent';
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
    const scrollPositionRef = useRef<number>(0);
    const previousScrollHeightRef = useRef<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const messagesContainer = messagesEndRef.current?.parentElement;
        if (messagesContainer) {
            if (isLoading) {
                const newScrollHeight = messagesContainer.scrollHeight;
                const heightDifference = newScrollHeight - previousScrollHeightRef.current;
                messagesContainer.scrollTop = scrollPositionRef.current + heightDifference;
                setIsLoading(false);
            } else if (messagesContainer.scrollHeight <= messagesContainer.clientHeight) {
                loadMessages();
            } else {
                scrollToBottom();
            }
        }
    }, [messages]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight } = event.currentTarget;

        if (!isLoading && !isScrollOver && scrollTop === 0) {
            setIsLoading(true);
            setTimeout(() => {
                scrollPositionRef.current = scrollTop;
                previousScrollHeightRef.current = scrollHeight;
                loadMessages();
            }, 2000);
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

            if (message.content) {
                messageElements.push(
                    <div key={message.id} className={isCurrentUserMessage ? styles.currentUser : styles.otherUser}>
                        <MessageComponent message={message} isCurrentUserMessage={isCurrentUserMessage} />
                    </div>
                );
            }
        });

        messageElements.push(<div ref={messagesEndRef} />);

        return messageElements;
    };

    return (
        <div className={styles.messages} onScroll={handleScroll}>
            {isLoading && (
                <div className={styles.loader}>
                    {/* TODO: Upgrade to use a better loader */}
                    <Loader color="#000" height={30} width={30} />
                </div>
            )}
            {renderMessages()}
        </div>
    );
};

export default MessagesList;
