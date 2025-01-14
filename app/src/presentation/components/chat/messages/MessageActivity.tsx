import { useHistory } from 'react-router';
import SmallActivityCard from '../../card/SmallActivityCard';
import { MessageProps } from '../MessageComponent';
import styles from '../MessageComponent.module.css';
import LikeButton from './LikeButton';

const MessageActivity: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;
    const history = useHistory();

    const handleActivityPressed = () => {
        history.push(`/learning`, { activityId: message.metadata?.activity?.id });
    };

    if (!message.metadata.activity) {
        return <div />;
    }

    return (
        <div className={messageClass}>
            <SmallActivityCard activity={message.metadata.activity} onClick={handleActivityPressed} />
            <LikeButton message={message} isCurrentUserMessage={isCurrentUserMessage} />
        </div>
    );
};

export default MessageActivity;
