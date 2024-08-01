import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { DownloadSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import styles from './MediaComponent.module.css';

interface MessageProps {
    message: Message;
    isCurrentUserMessage?: boolean;
}

const MediaComponent: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const { t } = useTranslation();
    const headerClass = isCurrentUserMessage ? styles.alignRight : styles.alignLeft;
    const name = isCurrentUserMessage ? t('chat.me') : `${message.sender.firstname} ${message.sender.lastname}`;
    const date = `${t(message.getMessageDate())} ${message.getMessageHour()}`;

    const renderMessageContent = () => {
        switch (message.type) {
            case MessageType.Image:
                return <MessageImage message={message} />;
            case MessageType.File:
                return <MessageFile message={message} isCurrentUserMessage={isCurrentUserMessage} />;
            default:
                return null;
        }
    };

    return (
        <div
            className={`${message.type === MessageType.Image ? styles.imageMessageContainer : styles.messageContainer}`}
        >
            {message.type !== MessageType.Image && (
                <div className={`${styles.header} ${headerClass}`}>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.date}>{date}</span>
                </div>
            )}

            {renderMessageContent()}
        </div>
    );
};

const MessageImage: React.FC<MessageProps> = ({ message }) => {
    const { t } = useTranslation();
    return <img className={styles.image} src={message.content} alt={t('chat.medias.images-alt') as string} />;
};

const MessageFile: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const { fileAdapter } = useConfig();
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;
    const fileName = message.content.split('/')[5].split('?')[0];

    const handleDownload = async () => {
        await fileAdapter.saveFile(message.content, fileName);
        showToast({
            message: t('chat.fileDownloaded'),
            duration: 2000,
        });
    };

    return (
        <div className={`${styles.messageFile} ${messageClass}`}>
            <button className={styles.downloadButton} onClick={handleDownload}>
                <div className={styles.downloadContainer}>
                    <span className={styles.downloadTitle}>{fileName}</span>
                    <img className={styles.download} src={DownloadSvg} alt="Download" />
                </div>
            </button>
        </div>
    );
};

export default MediaComponent;
