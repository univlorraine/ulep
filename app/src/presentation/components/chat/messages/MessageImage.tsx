import { IonButton } from '@ionic/react';
import { MessageProps } from '../MessageComponent';
import styles from '../MessageComponent.module.css';
import LikeButton from './LikeButton';

const MessageImage: React.FC<MessageProps> = ({ message, isCurrentUserMessage, setImageToDisplay }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    const openModal = () => {
        if (setImageToDisplay) {
            setImageToDisplay(message.content);
        }
    };

    return (
        <div className={`${styles.messageImage} ${messageClass}`}>
            <IonButton fill="clear" onClick={openModal}>
                <img className={styles.image} src={message.getThumbnail()} />
            </IonButton>
            <LikeButton message={message} isCurrentUserMessage={isCurrentUserMessage} />
        </div>
    );
};

export default MessageImage;
