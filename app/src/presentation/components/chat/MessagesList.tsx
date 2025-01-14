import { IonText } from '@ionic/react';
import { isSameDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { MessagePaginationDirection } from '../../../domain/entities/chat/Conversation';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import { useMessages } from '../../hooks/useMessages';
import Loader from '../Loader';
import MessageComponent from './MessageComponent';
import styles from './MessagesList.module.css';

interface MessagesListProps {
    currentMessageSearchId?: string;
    messages: Message[];
    messageToReply?: Message;
    isCommunity: boolean;
    isScrollForwardOver: boolean;
    isScrollBackwardOver: boolean;
    loadMessages: (direction: MessagePaginationDirection) => void;
    onLikeMessage: (messageId: string) => void;
    onUnlikeMessage: (messageId: string) => void;
    onReplyToMessage: (message: Message) => void;
    userId: string;
    setImageToDisplay: (imageUrl: string) => void;
    onCancelReply: () => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
    currentMessageSearchId,
    messages,
    messageToReply,
    isCommunity,
    isScrollForwardOver,
    isScrollBackwardOver,
    loadMessages,
    userId,
    setImageToDisplay,
    onLikeMessage,
    onUnlikeMessage,
    onReplyToMessage,
    onCancelReply,
}) => {
    const { t } = useTranslation();
    const { isLoading, messagesEndRef, handleScroll } = useMessages({
        messages,
        isScrollForwardOver,
        isScrollBackwardOver,
        isSearchMode: Boolean(currentMessageSearchId),
        loadMessages,
    });

    const renderMessages = () => {
        const messageElements: React.ReactNode[] = [];
        let lastDate: Date | null = null;

        if (messages.length === 0)
            return (
                <div className={styles['no-messages']}>
                    <IonText>{t('chat.noMessages')}</IonText>
                </div>
            );

        const reversedMessages = [...messages].reverse();

        reversedMessages.forEach((message) => {
            const messageDate = new Date(message.createdAt);
            const isCurrentUserMessage = message.isMine(userId);

            if (!Boolean(messageToReply) && (!lastDate || !isSameDay(lastDate, messageDate))) {
                messageElements.push(
                    <div key={`id-${message.id}`} className={styles.dateSeparator}>
                        {t(message.getMessageDate())}
                    </div>
                );
                lastDate = messageDate;
            }

            if (message.content) {
                messageElements.push(
                    <div
                        ref={message.id === currentMessageSearchId ? messagesEndRef : null}
                        role="listitem"
                        key={message.id}
                        className={isCurrentUserMessage ? styles.currentUser : styles.otherUser}
                    >
                        <MessageComponent
                            currentMessageSearchId={currentMessageSearchId}
                            message={message}
                            isCurrentUserMessage={isCurrentUserMessage}
                            isCommunity={isCommunity}
                            setImageToDisplay={message.type === MessageType.Image ? setImageToDisplay : undefined}
                            onLikeMessage={onLikeMessage}
                            onUnlikeMessage={onUnlikeMessage}
                            onReplyToMessage={onReplyToMessage}
                            isInReply={Boolean(messageToReply)}
                        />
                    </div>
                );
            }
        });

        return messageElements;
    };

    return (
        <div className={styles.messages} onScroll={handleScroll} role="list">
            {isLoading && (
                <div className={styles.loader}>
                    {/* TODO: Upgrade to use a better loader */}
                    <Loader color="#000" height={30} width={30} />
                </div>
            )}
            {renderMessages()}
            <div ref={!currentMessageSearchId ? messagesEndRef : null} />
        </div>
    );
};

export default MessagesList;
