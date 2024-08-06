import { IonButton, IonIcon, IonText, useIonToast } from '@ionic/react';
import { documentOutline, linkOutline, musicalNoteOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { DownloadSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import AudioLine from '../AudioLine';
import styles from './MediaComponent.module.css';

interface MessageProps {
    message: Message;
}

const MediaComponent: React.FC<MessageProps> = ({ message }) => {
    const renderMessageContent = () => {
        switch (message.type) {
            case MessageType.Image:
                return <MessageImage message={message} />;
            case MessageType.File:
                return <MessageFile message={message} />;
            case MessageType.Audio:
                return <MessageAudio message={message} />;
            case MessageType.Link:
                return <MessageLink message={message} />;
            default:
                return null;
        }
    };

    return (
        <div
            role="list"
            className={`${message.type === MessageType.Image ? styles.imageMessageContainer : styles.messageContainer}`}
        >
            {renderMessageContent()}
        </div>
    );
};

const MessageImage: React.FC<MessageProps> = ({ message }) => {
    const { t } = useTranslation();
    return <img className={styles.image} src={message.content} alt={t('chat.medias.images-alt') as string} />;
};

const MessageAudio: React.FC<MessageProps> = ({ message }) => {
    return (
        <div className={styles.messageAudio}>
            <IonIcon icon={musicalNoteOutline} size="large" />
            <AudioLine audioFile={message.content} />
        </div>
    );
};

const MessageLink: React.FC<MessageProps> = ({ message }) => {
    const { browserAdapter } = useConfig();
    const og = message.metadata?.openGraphResult;

    const openLink = async () => {
        await browserAdapter.open(message.content);
    };

    return (
        <IonButton
            id={`message-container-${message.id}`}
            fill="clear"
            className={styles.messageLink}
            onClick={openLink}
        >
            <div className={styles.linkContainer}>
                <div className={styles.linkImageContainer}>
                    {og?.ogImage?.[0]?.url ? (
                        <div className={styles.linkImage}>
                            <img src={og?.ogImage?.[0]?.url} alt={og?.ogTitle} className={styles.linkImageImg} />
                        </div>
                    ) : (
                        <IonIcon icon={linkOutline} size="medium" className={styles.linkIcon} />
                    )}
                </div>
                <div className={styles.linkTextContainer}>
                    <IonText className={styles.linkText}>{og?.ogTitle}</IonText>
                    <IonText className={styles.linkTextUrl}>{og?.ogUrl}</IonText>
                </div>
            </div>
        </IonButton>
    );
};

const MessageFile: React.FC<MessageProps> = ({ message }) => {
    const { fileAdapter } = useConfig();
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const fileName = message.content.split('/')[5].split('?')[0];

    const handleDownload = async () => {
        await fileAdapter.saveFile(message.content, fileName);
        showToast({
            message: t('chat.fileDownloaded'),
            duration: 2000,
        });
    };

    return (
        <div className={styles.messageFile} role="listitem">
            <IonButton fill="clear" className={styles.downloadButton} onClick={handleDownload}>
                <div className={styles.downloadContainer}>
                    <div className={styles.downloadIconContainer}>
                        <IonIcon icon={documentOutline} size="large" />
                        <span className={styles.downloadTitle}>{decodeURI(fileName)}</span>
                    </div>
                    <IonIcon
                        className={styles.download}
                        icon={DownloadSvg}
                        aria-label={t('gloabl.download') as string}
                    />
                </div>
            </IonButton>
        </div>
    );
};

export default MediaComponent;
