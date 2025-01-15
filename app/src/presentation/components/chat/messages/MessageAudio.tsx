import AudioLine from '../../AudioLine';
import { MessageProps } from '../MessageComponent';
import styles from '../MessageComponent.module.css';

const MessageAudio: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return (
        <div className={`${styles.messageAudio} ${messageClass}`}>
            <AudioLine audioFile={message.content} />
        </div>
    );
};

export default MessageAudio;
