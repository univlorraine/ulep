import styles from '../MessageComponent.module.css';

interface MessageParentProps {
    children: React.ReactNode;
}

const MessageParent: React.FC<MessageParentProps> = ({ children }) => {
    return <div className={styles.messageParent}>{children}</div>;
};

export default MessageParent;
