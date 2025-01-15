import { IonButton, IonIcon, IonText, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { DownloadSvg } from '../../../../assets';
import { useConfig } from '../../../../context/ConfigurationContext';
import { MessageProps } from '../MessageComponent';
import styles from '../MessageComponent.module.css';
import LikeButton from './LikeButton';
const MessageFile: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const { fileAdapter } = useConfig();
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;
    const fileName = decodeURI(message.metadata?.originalFilename);

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
        <div className={messageClass}>
            <IonButton fill="clear" className={styles.downloadButton} onClick={handleDownload}>
                <IonText className={styles.downloadTitle}>{fileName}</IonText>
                <IonIcon
                    aria-label={t('chat.ariaLabelFileDownloaded', { filename: fileName }) as string}
                    className={styles.download}
                    icon={DownloadSvg}
                />
            </IonButton>
            <LikeButton message={message} isCurrentUserMessage={isCurrentUserMessage} />
        </div>
    );
};

export default MessageFile;
