import { isSameDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Message } from '../../../domain/entities/chat/Message';
import { useMessages } from '../../hooks/useMessages';
import Loader from '../Loader';
import MediaComponent from './MediaComponent';
import styles from './MediasList.module.css';

interface MediasListProps {
    messages: Message[];
    isScrollOver: boolean;
    loadMessages: () => void;
    userId: string;
}

const MediasList: React.FC<MediasListProps> = ({ messages, isScrollOver, loadMessages, userId }) => {
    const { t } = useTranslation();
    const { isLoading, messagesEndRef, handleScroll } = useMessages({ messages, isScrollOver, loadMessages });

    const renderMessages = () => {
        const messageElements: React.ReactNode[] = [];
        let lastDate: Date | null = null;

        const reversedMessages = [...messages].reverse();

        reversedMessages.forEach((message) => {
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
                messageElements.push(<MediaComponent message={message} isCurrentUserMessage={isCurrentUserMessage} />);
            }
        });

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
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MediasList;
