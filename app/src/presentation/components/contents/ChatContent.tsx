import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonPopover } from '@ionic/react';
import { imageOutline, searchOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { KebabSvg, LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Conversation, { MessagePaginationDirection } from '../../../domain/entities/chat/Conversation';
import useHandleMessagesFromConversation from '../../hooks/useHandleMessagesFromConversation';
import Loader from '../Loader';
import ChatInputSender from '../chat/ChatInputSender';
import ConversationSearchBar from '../chat/ConversationSearchBar';
import MessagesList from '../chat/MessagesList';
import styles from './ChatContent.module.css';

//TODO: modale to display picture on full screen ( almost ? )
interface ChatContentProps {
    conversation: Conversation;
    goBack?: () => void;
    isHybrid: boolean;
    profile: Profile;
    setCurrentContent?: (content: string) => void;
}

const Content: React.FC<ChatContentProps> = ({ conversation, goBack, profile, setCurrentContent }) => {
    const { t } = useTranslation();
    const { recorderAdapter, socketIoAdapter } = useConfig();
    const isBlocked = conversation.isBlocked;
    const [showMenu, setShowMenu] = useState(false);
    const [currentMessageSearchId, setCurrentMessageSearchId] = useState<string>();
    const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
    const history = useHistory();

    const { messages, isScrollForwardOver, isScrollBackwardOver, isLoading, loadMessages, addNewMessage } =
        useHandleMessagesFromConversation({
            conversationId: conversation.id,
        });

    const setSearchMode = () => {
        setShowMenu(false);
        setIsSearchMode(true);
    };

    const loadMessageFromSearch = (messageId: string) => {
        setCurrentMessageSearchId(messageId);
        loadMessages(true, MessagePaginationDirection.BOTH, messageId);
    };

    useEffect(() => {
        recorderAdapter.requestPermission();
        socketIoAdapter.connect();
        socketIoAdapter.onMessage(conversation.id, addNewMessage);

        return () => {
            socketIoAdapter.disconnect();
            socketIoAdapter.offMessage();
        };
    }, [conversation.id]);

    return (
        <div className={`${styles.container} content-wrapper`}>
            <div className={styles.header}>
                {goBack && (
                    <IonButton
                        fill="clear"
                        onClick={goBack}
                        aria-label={t('chat.conversation_menu.aria_label') as string}
                    >
                        <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                    </IonButton>
                )}
                <h2 className={styles.title}>
                    {t('chat.title', {
                        name: Conversation.getMainConversationPartner(conversation, profile.user.id).firstname,
                    })}
                </h2>
                <IonButton
                    fill="clear"
                    id="click-trigger"
                    className={styles['kebab-button']}
                    onClick={() => setShowMenu(!showMenu)}
                    aria-label={t('chat.conversation_menu.aria_label') as string}
                >
                    <IonIcon icon={KebabSvg} size="medium" aria-hidden="true" />
                </IonButton>
                <IonPopover trigger="click-trigger" triggerAction="click" isOpen={showMenu} showBackdrop={false}>
                    <IonContent>
                        <IonList lines="none">
                            <IonItem
                                button={true}
                                onClick={() =>
                                    setCurrentContent
                                        ? setCurrentContent('media')
                                        : history.push('/media', { conversation })
                                }
                            >
                                <IonIcon icon={imageOutline} aria-hidden="true" />
                                <IonLabel className={styles['chat-popover-label']}>
                                    {t('chat.conversation_menu.medias')}
                                </IonLabel>
                            </IonItem>
                            <IonItem button={true} onClick={setSearchMode}>
                                <IonIcon icon={searchOutline} aria-hidden="true" />
                                <IonLabel className={styles['chat-popover-label']}>
                                    {t('chat.conversation_menu.search')}
                                </IonLabel>
                            </IonItem>
                        </IonList>
                    </IonContent>
                </IonPopover>
            </div>
            {isSearchMode && (
                <ConversationSearchBar
                    conversation={conversation}
                    loadMessages={loadMessageFromSearch}
                    setIsSearchMode={setIsSearchMode}
                />
            )}
            {!isLoading ? (
                <MessagesList
                    currentMessageSearchId={currentMessageSearchId}
                    messages={messages}
                    loadMessages={(direction) => loadMessages(false, direction)}
                    userId={profile.user.id}
                    isScrollForwardOver={isScrollForwardOver}
                    isScrollBackwardOver={isScrollBackwardOver}
                />
            ) : (
                <div className={styles.loader}>
                    <Loader />
                </div>
            )}
            {!isSearchMode && <ChatInputSender isBlocked={isBlocked} profile={profile} conversation={conversation} />}
        </div>
    );
};

const ChatContent: React.FC<ChatContentProps> = ({ conversation, isHybrid, goBack, profile, setCurrentContent }) => {
    if (!isHybrid) {
        return (
            <Content
                conversation={conversation}
                goBack={goBack}
                profile={profile}
                isHybrid={isHybrid}
                setCurrentContent={setCurrentContent}
            />
        );
    }

    return (
        <IonPage className={styles.content}>
            <Content
                conversation={conversation}
                goBack={goBack}
                profile={profile}
                isHybrid={isHybrid}
                setCurrentContent={setCurrentContent}
            />
        </IonPage>
    );
};

export default ChatContent;
