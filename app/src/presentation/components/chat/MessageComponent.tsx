import { IonButton, IonIcon, IonPopover, IonText, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadSvg, KebabSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import AudioLine from '../AudioLine';
import OGCard from '../card/OGCard';
import styles from './MessageComponent.module.css';

interface MessageProps {
    isCurrentUserMessage: boolean;
    message: Message;
    currentMessageSearchId?: string;
    onMessagePressed?: (e: React.MouseEvent<HTMLIonButtonElement>) => void;
    setImageToDisplay?: (imageUrl: string) => void;
}

const MessageComponent: React.FC<MessageProps> = ({
    message,
    isCurrentUserMessage,
    currentMessageSearchId,
    setImageToDisplay,
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
                        currentMessageSearchId={currentMessageSearchId}
                    />
                );
            case MessageType.Image:
                return (
                    <MessageImage
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        setImageToDisplay={setImageToDisplay}
                    />
                );
            case MessageType.Audio:
                return <MessageAudio message={message} isCurrentUserMessage={isCurrentUserMessage} />;
            case MessageType.File:
                return <MessageFile message={message} isCurrentUserMessage={isCurrentUserMessage} />;
            case MessageType.Link:
                return (
                    <MessageLink
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        currentMessageSearchId={currentMessageSearchId}
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
                    {renderMessageContent()}
                    {!isCurrentUserMessage && (
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
                <IonButton fill="clear" className={styles.reportButton} onClick={reportMessage}>
                    <IonText className={styles.reportButtonText}>{t('chat.reportMessageButton')}</IonText>
                </IonButton>
            </IonPopover>
        </>
    );
};

const MessageText: React.FC<MessageProps> = ({ message, isCurrentUserMessage, currentMessageSearchId }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return (
        <div
            className={`${styles.message} ${messageClass} ${
                message.id === currentMessageSearchId ? styles.searchMessage : ''
            }`}
        >
            {message.content}
        </div>
    );
};

const MessageImage: React.FC<MessageProps> = ({ message, isCurrentUserMessage, setImageToDisplay }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    const openModal = () => {
        if (setImageToDisplay) {
            setImageToDisplay(message.content);
        }
    };

    return (
        <IonButton fill="clear" className={`${styles.messageImage} ${messageClass}`} onClick={openModal}>
            <img className={styles.image} src={message.getThumbnail()} />
        </IonButton>
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

const MessageFile: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const { fileAdapter } = useConfig();
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;
    const fileName = message.metadata?.originalFilename;

    const handleDownload = async (e: React.MouseEvent<HTMLIonButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        await fileAdapter.saveFile(message.content, decodeURI(fileName));
        showToast({
            message: t('chat.fileDownloaded'),
            duration: 2000,
        });
    };

    return (
        <div className={messageClass}>
            <IonButton fill="clear" className={styles.downloadButton} onClick={handleDownload}>
                <IonText className={styles.downloadTitle}>{decodeURI(fileName)}</IonText>
                <IonIcon
                    aria-label={t('chat.ariaLabelFileDownloaded', { filename: fileName }) as string}
                    className={styles.download}
                    icon={DownloadSvg}
                />
            </IonButton>
        </div>
    );
};

const MessageLink: React.FC<MessageProps> = ({ message, isCurrentUserMessage, currentMessageSearchId }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.content.split(linkRegex);

    return (
        <div
            className={`${styles.messageLink} ${messageClass} ${
                message.id === currentMessageSearchId ? styles.searchMessage : ''
            } ${styles.outerContainer}`}
        >
            <OGCard
                imageUrl={message.metadata?.openGraphResult?.ogImage?.[0]?.url}
                title={message.metadata?.openGraphResult?.ogTitle}
                description={message.metadata?.openGraphResult?.ogDescription}
                url={message.content}
            />
            <IonText className={styles.linkText}>
                {parts.map((part, index) =>
                    linkRegex.test(part) ? (
                        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                            {part}
                        </a>
                    ) : (
                        part
                    )
                )}
            </IonText>
        </div>
    );
};

export default MessageComponent;
