import { isSameDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import { useMessages } from '../../hooks/useMessages';
import Loader from '../Loader';
import MediaComponent from './MediaComponent';
import styles from './MediasList.module.css';

interface MediasListProps {
    messages: Message[];
    isScrollOver: boolean;
    loadMessages: () => void;
    selectedFilter: MessageType;
    setImageToDisplay?: (image: string) => void;
}

const MediasList: React.FC<MediasListProps> = ({
    messages,
    isScrollOver,
    loadMessages,
    selectedFilter,
    setImageToDisplay,
}) => {
    const { t } = useTranslation();
    const { isLoading, messagesEndRef, handleScroll } = useMessages({
        messages,
        isScrollForwardOver: isScrollOver,
        isScrollBackwardOver: true,
        loadMessages,
        isSearchMode: false,
    });

    const renderMessages = () => {
        const containerElements: React.ReactNode[] = [];
        const messageElements: { [key: string]: React.ReactNode[] } = {};
        let lastDate: Date | null = null;

        const reversedMessages = [...messages].reverse();

        reversedMessages.forEach((message, index) => {
            const messageDate = new Date(message.createdAt);

            if (!lastDate || !isSameDay(lastDate, messageDate)) {
                messageElements[t(message.getMessageDate())] = [];
                lastDate = messageDate;
            }

            if (message.content) {
                messageElements[t(message.getMessageDate())].push(
                    <MediaComponent
                        key={message.id}
                        message={message}
                        setImageToDisplay={message.type === MessageType.Image ? setImageToDisplay : undefined}
                    />
                );
            }
        });

        Object.keys(messageElements).forEach((key) => {
            containerElements.push(
                <div key={`id-header-${key}`} className={styles.dateSeparator}>
                    {key}
                </div>
            );
            containerElements.push(
                <div key={`id-${key}`} className={styles.messagesContent}>
                    {[...messageElements[key]]}
                </div>
            );
        });

        return containerElements;
    };

    return (
        <div className={styles.messages} onScroll={handleScroll}>
            {isLoading && (
                <div className={styles.loader}>
                    {/* TODO: Upgrade to use a better loader */}
                    <Loader color="#000" height={30} width={30} />
                </div>
            )}
            {selectedFilter === MessageType.Image ? (
                <div className={styles.messagesContainer}>{renderMessages()}</div>
            ) : (
                renderMessages()
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MediasList;
