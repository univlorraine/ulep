import { IonButton, IonIcon, IonPopover, IonText, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Message } from '../../../domain/entities/chat/Message';
import AudioLine from '../AudioLine';
import styles from './MessageComponent.module.css';

interface MessageProps {
    isCurrentUserMessage: boolean;
    message: Message;
    onMessagePressed?: (e: React.MouseEvent<HTMLIonButtonElement>) => void;
}

const MessageComponent: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
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
            t('chat.messageReport', {
                firstname: message.sender.firstname,
                lastname: message.sender.lastname,
                date: message.createdAt.toLocaleDateString('fr-FR'),
                message: message.content,
            })
        );

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

    const onMessagePressed = (e: React.MouseEvent<HTMLIonButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPopoverEvent(e);
        setDisplayPopover(!displayPopover);
    };

    const renderMessageContent = (onMessagePressed: (e: React.MouseEvent<HTMLIonButtonElement>) => void) => {
        switch (message.type) {
            case 'text':
                return (
                    <MessageText
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        onMessagePressed={onMessagePressed}
                    />
                );
            case 'image':
                return (
                    <MessageImage
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        onMessagePressed={onMessagePressed}
                    />
                );
            case 'audio':
                return (
                    <MessageAudio
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        onMessagePressed={onMessagePressed}
                    />
                );
            case 'file':
                return (
                    <MessageFile
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        onMessagePressed={onMessagePressed}
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
                {renderMessageContent(onMessagePressed)}
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

const MessageText: React.FC<MessageProps> = ({ message, isCurrentUserMessage, onMessagePressed }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return (
        <IonButton
            id={`message-container-${message.id}`}
            fill="clear"
            className={`${styles.message} ${messageClass}`}
            onClick={onMessagePressed}
        >
            {message.content}
        </IonButton>
    );
};

const MessageImage: React.FC<MessageProps> = ({ message, isCurrentUserMessage, onMessagePressed }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return (
        <IonButton
            id={`message-container-${message.id}`}
            fill="clear"
            className={`${styles.messageImage} ${messageClass}`}
            onClick={onMessagePressed}
        >
            <img className={styles.image} src={message.content} />
        </IonButton>
    );
};

const MessageAudio: React.FC<MessageProps> = ({ message, isCurrentUserMessage, onMessagePressed }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return (
        <IonButton fill="clear" className={`${styles.messageAudio} ${messageClass}`} onClick={onMessagePressed}>
            <AudioLine audioFile={message.content} />
        </IonButton>
    );
};

const MessageFile: React.FC<MessageProps> = ({ message, isCurrentUserMessage, onMessagePressed }) => {
    const { fileAdapter } = useConfig();
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;
    const fileName = message.content.split('/')[5].split('?')[0];

    const handleDownload = async (e: React.MouseEvent<HTMLIonButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        await fileAdapter.saveFile(message.content, fileName);
        showToast({
            message: t('chat.fileDownloaded'),
            duration: 2000,
        });
    };

    return (
        <IonButton
            id={`message-container-${message.id}`}
            fill="clear"
            className={`${messageClass}`}
            onClick={onMessagePressed}
        >
            <IonButton fill="clear" className={styles.downloadButton} onClick={handleDownload}>
                <div className={styles.downloadContainer}>
                    <IonText className={styles.downloadTitle}>{fileName}</IonText>
                    <IonIcon
                        aria-label={t('chat.ariaLabelFileDownloaded', { filename: fileName }) as string}
                        className={styles.download}
                        src={DownloadSvg}
                    />
                </div>
            </IonButton>
        </IonButton>
    );
};

export default MessageComponent;
