import { IonAvatar, IonButton, IonIcon, IonPopover, IonText, useIonToast } from '@ionic/react';
import { alertCircleOutline, arrowUndoOutline, thumbsUpOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KebabSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import NetworkImage from '../NetworkImage';
import styles from './MessageComponent.module.css';
import MessageActivity from './messages/MessageActivity';
import MessageAudio from './messages/MessageAudio';
import MessageFile from './messages/MessageFile';
import MessageImage from './messages/MessageImage';
import MessageLink from './messages/MessageLink';
import MessageText from './messages/MessageText';
import MessageVocabulary from './messages/MessageVocabulary';

interface ChatAvatarProps {
    avatar?: string;
    firstname: string;
    lastname: string;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ avatar, firstname, lastname }) => (
    <NetworkImage
        className={styles.avatarContainer}
        id={avatar ?? ''}
        aria-hidden={true}
        onErrorComponent={() => (
            <IonAvatar className={styles.image} aria-hidden={true}>
                <span className={styles.avatarLetter}>
                    {firstname[0].toUpperCase()}
                    {lastname[0].toUpperCase()}
                </span>
            </IonAvatar>
        )}
    />
);

export interface MessageProps {
    isCurrentUserMessage: boolean;
    isCommunity: boolean;
    message: Message;
    isInReply?: boolean;
    hideContextMenu?: boolean;
    currentMessageSearchId?: string;
    onMessagePressed?: (e: React.MouseEvent<HTMLIonButtonElement>) => void;
    onLikeMessage?: (messageId: string) => void;
    onUnlikeMessage?: (messageId: string) => void;
    setImageToDisplay?: (imageUrl: string) => void;
    onReplyToMessage?: (message: Message) => void;
}

const MessageComponent: React.FC<MessageProps> = ({
    message,
    isCurrentUserMessage,
    isCommunity,
    isInReply,
    hideContextMenu,
    currentMessageSearchId,
    setImageToDisplay,
    onLikeMessage,
    onUnlikeMessage,
    onReplyToMessage,
}) => {
    const { t } = useTranslation();
    const { createReportMessage } = useConfig();
    const [showToast] = useIonToast();
    const headerClass = isCurrentUserMessage ? styles.alignRight : styles.alignLeft;
    const name = isCurrentUserMessage ? t('chat.me') : `${message.sender.firstname} ${message.sender.lastname}`;
    const date = `${t(message.getMessageDate())} ${message.getMessageHour()}`;
    const [displayPopover, setDisplayPopover] = useState<boolean>(false);
    const [popoverEvent, setPopoverEvent] = useState<React.MouseEvent<HTMLIonButtonElement> | null>(null);

    const reportMessage = async () => {
        const result = await createReportMessage.execute(
            t(
                message.type === MessageType.Text || message.type === MessageType.Link
                    ? 'chat.messageReport'
                    : 'chat.mediaReport',
                {
                    firstname: message.sender.firstname,
                    lastname: message.sender.lastname,
                    date: message.createdAt.toLocaleDateString('fr-FR'),
                    message: message.content,
                }
            ),
            message.sender.id,
            message.metadata?.filePath,
            message.type
        );

        setDisplayPopover(false);

        if (result instanceof Error) {
            return showToast({
                message: t(result.message),
                duration: 2000,
            });
        }

        return showToast({
            message: t('chat.messageReported'),
            duration: 2000,
        });
    };

    const manageLikeOnMessage = () => {
        if (message.didLike) {
            onUnlikeMessage?.(message.id);
        } else {
            onLikeMessage?.(message.id);
        }
        setDisplayPopover(false);
    };

    const replyToMessage = () => {
        onReplyToMessage?.(message);
        setDisplayPopover(false);
    };

    const onOpenActionsPopover = (e: React.MouseEvent<HTMLIonButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPopoverEvent(e);
        setDisplayPopover(!displayPopover);
    };

    const renderMessageContent = () => {
        switch (message.type) {
            case MessageType.Text:
                return (
                    <MessageText
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                        currentMessageSearchId={currentMessageSearchId}
                    />
                );
            case MessageType.Image:
                return (
                    <MessageImage
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                        setImageToDisplay={setImageToDisplay}
                    />
                );
            case MessageType.Audio:
                return (
                    <MessageAudio
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                    />
                );
            case MessageType.File:
                return (
                    <MessageFile
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                    />
                );
            case MessageType.Link:
                return (
                    <MessageLink
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                        currentMessageSearchId={currentMessageSearchId}
                    />
                );
            case MessageType.Vocabulary:
                return (
                    <MessageVocabulary
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                    />
                );
            case MessageType.Activity:
                return (
                    <MessageActivity
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className={styles.messageContainer}>
                <div className={`${styles.header} ${headerClass}`}>
                    <IonText className={styles.name}>{name}</IonText>
                    <IonText className={styles.date}>{date}</IonText>
                </div>
                <div className={styles.messageContent}>
                    {isCommunity && !isCurrentUserMessage && (
                        <ChatAvatar
                            avatar={message.sender.avatar?.id}
                            firstname={message.sender.firstname}
                            lastname={message.sender.lastname}
                        />
                    )}
                    {renderMessageContent()}
                    {!isCurrentUserMessage && !hideContextMenu && (
                        <IonButton
                            fill="clear"
                            className={styles.rightMessageMenu}
                            onClick={onOpenActionsPopover}
                            size="small"
                        >
                            <IonIcon icon={KebabSvg} />
                        </IonButton>
                    )}
                </div>
                {!isInReply && message.numberOfReplies > 0 && (
                    <IonButton
                        fill="clear"
                        className={`${styles.reply} ${isCurrentUserMessage ? styles.rightReply : styles.leftReply} ${
                            message.likes > 0 ? styles.replyWithLike : styles.replyWithoutLike
                        }`}
                        size="small"
                        onClick={() => onReplyToMessage?.(message)}
                    >
                        {t(message.numberOfReplies > 1 ? 'chat.numberOfReplies_plural' : 'chat.numberOfReplies', {
                            count: message.numberOfReplies,
                        })}
                    </IonButton>
                )}
            </div>
            <IonPopover
                event={popoverEvent}
                side="bottom"
                alignment="center"
                size="auto"
                showBackdrop={false}
                isOpen={displayPopover}
                onDidPresent={() => setDisplayPopover(true)}
                onDidDismiss={() => setDisplayPopover(false)}
                className={styles.fullHeightPopover}
            >
                {isCommunity && (
                    <IonButton fill="clear" className={styles.contextButton} onClick={manageLikeOnMessage}>
                        <IonIcon icon={thumbsUpOutline} className={styles.contextButtonIcon} />
                        <IonText className={styles.contextButtonText}>
                            {message.didLike ? t('chat.unlikeMessageButton') : t('chat.likeMessageButton')}
                        </IonText>
                    </IonButton>
                )}
                {isCommunity && !isInReply && (
                    <IonButton fill="clear" className={styles.contextButton} onClick={replyToMessage}>
                        <IonIcon icon={arrowUndoOutline} className={styles.contextButtonIcon} />
                        <IonText className={styles.contextButtonText}>{t('chat.replyMessageButton')}</IonText>
                    </IonButton>
                )}
                <IonButton fill="clear" className={styles.contextButton} onClick={reportMessage}>
                    <IonIcon icon={alertCircleOutline} className={styles.contextButtonIcon} />
                    <IonText className={styles.contextButtonText}>{t('chat.reportMessageButton')}</IonText>
                </IonButton>
            </IonPopover>
        </>
    );
};

export default MessageComponent;
