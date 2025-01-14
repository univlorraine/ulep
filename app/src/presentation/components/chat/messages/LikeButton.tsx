import { IonIcon, IonText } from '@ionic/react';
import { thumbsUp } from 'ionicons/icons';
import { Message } from '../../../../domain/entities/chat/Message';
import styles from '../MessageComponent.module.css';

interface LikeButtonProps {
    message: Message;
    isCurrentUserMessage: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ isCurrentUserMessage, message }) => {
    if (message.likes === 0) {
        return null;
    }

    return (
        <div
            className={`${isCurrentUserMessage ? styles.likeContainerLeft : styles.likeContainerRight} ${styles.likeContainer}`}
        >
            <IonIcon icon={thumbsUp} className={styles.likeIcon} />
            <IonText className={styles.likeCount}>{message.likes}</IonText>
        </div>
    );
};

export default LikeButton;
