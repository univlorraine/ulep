import { IonIcon, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KebabSvg, LeftChevronSvg, PaperclipSvg, PictureSvg, SenderSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import { UserChat } from '../../../domain/entities/User';
import Conversation from '../../../domain/entities/chat/Conversation';
import { MessageWithConversationId } from '../../../domain/entities/chat/Message';
import useHandleMessagesFromConversation from '../../hooks/useHandleMessagesFromConversation';
import MessagesList from '../chat/MessagesList';
import styles from './ChatContent.module.css';

interface ChatContentProps {
    conversation: Conversation;
    goBack?: () => void;
    isHybrid: boolean;
    profile: Profile;
}

const Content: React.FC<Omit<ChatContentProps, 'isHybrid'>> = ({ conversation, goBack, profile }) => {
    const { t } = useTranslation();
    const { sendMessage, socketIoAdapter } = useConfig();
    const [message, setMessage] = useState<string>('');

    //TODO: Handle is loading and error
    const { messages, isLoading, isScrollOver, error, loadMessages, addNewMessage } = useHandleMessagesFromConversation(
        conversation.id
    );

    const onSendPressed = async () => {
        //TODO: Send message in conversation for now - idea ( no id = currently sent ? )
        setMessage('');
        const messageResult = await sendMessage.execute(conversation.id, profile.user.id, message);
        //TODO: Handle error for message
        if (messageResult instanceof Error) {
            return;
        }
        //TODO: Display message as sent now ?
        socketIoAdapter.emit(
            new MessageWithConversationId(
                messageResult.id,
                messageResult.content,
                messageResult.createdAt,
                new UserChat(
                    profile.user.id,
                    profile.user.firstname,
                    profile.user.lastname,
                    profile.user.email,
                    false,
                    profile.user.avatar
                ),
                messageResult.type,
                conversation.id
            )
        );
    };

    useEffect(() => {
        socketIoAdapter.connect();
        socketIoAdapter.onMessage(addNewMessage);

        return () => {
            socketIoAdapter.disconnect();
            socketIoAdapter.offMessage();
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {goBack ? <IonIcon icon={LeftChevronSvg} onClick={goBack} /> : <div />}
                <span className={styles.title}>
                    {t('chat.title', { name: conversation.getMainConversationPartner(profile.user.id).firstname })}
                </span>
                <IonIcon icon={KebabSvg} />
            </div>
            <MessagesList
                messages={messages}
                loadMessages={loadMessages}
                userId={profile.user.id}
                isScrollOver={isScrollOver}
            />
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
                    <IonIcon className={styles.sender} icon={SenderSvg} onClick={onSendPressed} />
                </div>
            </div>
        </div>
    );
};

const ChatContent: React.FC<ChatContentProps> = ({ conversation, isHybrid, goBack, profile }) => {
    if (!isHybrid) {
        return <Content conversation={conversation} goBack={goBack} profile={profile} />;
    }

    return (
        <IonPage className={styles.content}>
            <Content conversation={conversation} goBack={goBack} profile={profile} />
        </IonPage>
    );
};

export default ChatContent;
