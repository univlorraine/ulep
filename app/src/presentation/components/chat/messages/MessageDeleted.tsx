import { useTranslation } from 'react-i18next';
import { MessageProps } from '../MessageComponent';
import styles from '../MessageComponent.module.css';

const MessageDeleted: React.FC<MessageProps> = ({ isCurrentUserMessage }) => {
    const { t } = useTranslation();
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    return (
        <div className={`${styles.message} ${messageClass} ${styles.messageDeleted}`}>{t('message.type.deleted')}</div>
    );
};

export default MessageDeleted;
