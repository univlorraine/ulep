import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { documentOutline, musicalNoteOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { DownloadSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import MessageReport from '../../../domain/entities/MessageReport';
import AudioLine from '../AudioLine';
import styles from './MediaComponent.module.css';

interface MessageProps<T extends Message | MessageReport> {
    message: T;
    setImageToDisplay?: (image: string) => void;
}

const MediaComponent = <T extends Message | MessageReport>({ message, setImageToDisplay }: MessageProps<T>) => {
    const renderMessageContent = () => {
        switch (message.type) {
            case MessageType.Image:
                return <MessageImage message={message} setImageToDisplay={setImageToDisplay} />;
            case MessageType.File:
                return <MessageFile message={message} />;
            case MessageType.Audio:
                return <MessageAudio message={message} />;
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

const MessageImage: React.FC<MessageProps<Message | MessageReport>> = ({ message, setImageToDisplay }) => {
    const { t } = useTranslation();

    const showModal = () => {
        if (setImageToDisplay) {
            setImageToDisplay(message.content);
        }
    };
    return (
        <IonButton className={styles['image-button']} fill="clear" onClick={showModal}>
            <img className={styles.image} src={message.getThumbnail()} alt={t('chat.medias.images-alt') as string} />
        </IonButton>
    );
};

const MessageAudio: React.FC<MessageProps<Message | MessageReport>> = ({ message }) => {
    return (
        <div className={styles.messageAudio}>
            <IonIcon icon={musicalNoteOutline} size="large" />
            <AudioLine audioFile={message.content} />
        </div>
    );
};

const MessageFile: React.FC<MessageProps<Message | MessageReport>> = ({ message }) => {
    const { fileAdapter } = useConfig();
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const fileName = decodeURI(message.metadata?.originalFilename);

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
                        <span className={styles.downloadTitle}>{fileName}</span>
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
