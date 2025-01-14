import { IonText } from '@ionic/react';
import OGCard from '../../card/OGCard';
import { MessageProps } from '../MessageComponent';
import styles from '../MessageComponent.module.css';
import LikeButton from './LikeButton';

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
            <LikeButton message={message} isCurrentUserMessage={isCurrentUserMessage} />
        </div>
    );
};

export default MessageLink;
