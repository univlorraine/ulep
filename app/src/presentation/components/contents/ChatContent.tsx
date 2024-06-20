import { IonPage, IonHeader, IonContent, IonIcon } from '@ionic/react';
import { useState } from 'react';
import styles from './ChatContent.module.css';
import { KebabSvg, LeftChevronSvg, PaperclipSvg, PictureSvg, SenderSvg } from '../../../assets';
import { useTranslation } from 'react-i18next';
import Conversation from '../../../domain/entities/chat/Conversation';

interface ChatContentProps {
    conversation: Conversation;
    goBack?: () => void;
    isHybrid: boolean;
    userId: string;
}

const Content: React.FC<Omit<ChatContentProps, 'isHybrid'>> = ({ conversation, goBack, userId }) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState<string>('');

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                {goBack ? <IonIcon icon={LeftChevronSvg} onClick={goBack} /> : <div />}
                <span className={styles.title}>
                    {t('chat.title', { name: conversation.getMainConversationPartner(userId).firstname })}
                </span>
                <IonIcon icon={KebabSvg} />
            </div>
            <div className={styles.container}>
                <div className={styles.messages} />
                <div className={styles.footer}>
                    <div>
                        <IonIcon className={styles.icon} icon={PictureSvg} />
                        <IonIcon className={styles.icon} icon={PaperclipSvg} />
                    </div>
                    <div className={styles['sender-view']}>
                        <textarea
                            className={styles.input}
                            maxLength={1000}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t('chat.input.placeholder') ?? ''}
                            value={message}
                        />
                        <IonIcon className={styles.sender} icon={SenderSvg} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChatContent: React.FC<ChatContentProps> = ({ conversation, isHybrid, goBack, userId }) => {
    if (!isHybrid) {
        return <Content conversation={conversation} goBack={goBack} userId={userId} />;
    }

    return (
        <IonPage className={styles.content}>
            <Content conversation={conversation} goBack={goBack} userId={userId} />
        </IonPage>
    );
};

export default ChatContent;
