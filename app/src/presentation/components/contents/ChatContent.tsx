import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonPopover } from '@ionic/react';
import { imageOutline, searchOutline, videocam } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { KebabSvg, LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { useSocket } from '../../../context/SocketContext';
import Profile from '../../../domain/entities/Profile';
import Conversation, { MessagePaginationDirection } from '../../../domain/entities/chat/Conversation';
import { useStoreState } from '../../../store/storeTypes';
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
    setImageToDisplay: (imageUrl: string) => void;
}

const Content: React.FC<ChatContentProps> = ({
    conversation,
    goBack,
    profile,
    setCurrentContent,
    setImageToDisplay,
}) => {
    const { t } = useTranslation();
    const { socket } = useSocket();
    const { recorderAdapter } = useConfig();
    const isBlocked = conversation.isBlocked;
    const [showMenu, setShowMenu] = useState(false);
    const [currentMessageSearchId, setCurrentMessageSearchId] = useState<string>();
    const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
    const history = useHistory();
    const accessToken = useStoreState((state) => state.accessToken);
    const {
        messages,
        handleSendMessage,
        isScrollForwardOver,
        isScrollBackwardOver,
        isLoading,
        loadMessages,
        addNewMessage,
        clearMessages,
    } = useHandleMessagesFromConversation({
        conversationId: conversation.id,
    });
    const partner = Conversation.getMainConversationPartner(conversation, profile.id);
    let disconnectInterval: NodeJS.Timeout;

    const setSearchMode = () => {
        setShowMenu(false);
        setIsSearchMode(true);
    };

    const unsetSearchMode = () => {
        setIsSearchMode(false);
        setCurrentMessageSearchId(undefined);
        loadMessages(true, MessagePaginationDirection.FORWARD);
    };

    const loadMessageFromSearch = (messageId: string) => {
        setCurrentMessageSearchId(messageId);
        loadMessages(true, MessagePaginationDirection.BOTH, messageId);
    };

    const onOpenVideoCall = () => {
        history.push({
            pathname: '/jitsi',
            search: `?roomName=${conversation.id}`,
        });
    };

    useEffect(() => {
        recorderAdapter.requestPermission();
        socket.connect(accessToken);
        socket.onMessage(conversation.id, addNewMessage);

        // Its a trick to reconnect the socket if it is disconnected when the socket wont reconnect by itself
        // Must be changed when the websocket is fixed
        socket.onDisconnect(() => {
            disconnectInterval = setInterval(() => {
                if (!socket.isConnected()) {
                    socket.connect(accessToken);
                } else {
                    clearInterval(disconnectInterval);
                }
            }, 3000);
        });

        return () => {
            socket.disconnect();
            socket.offMessage();
            socket.offDisconnect();
            clearInterval(disconnectInterval);
        };
    }, [conversation.id]);

    return (
        <div className={`${styles.container} content-wrapper`}>
            <div className={styles.header}>
                {goBack && (
                    <IonButton
                        fill="clear"
                        onClick={goBack}
                        aria-label={t('chat.conversation_menu.return_to_conversations_aria_label') as string}
                    >
                        <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                    </IonButton>
                )}
                <div className={styles['title-container']}>
                    <h2 className={styles.title}>
                        {t('chat.title', {
                            name: partner.firstname,
                        })}
                    </h2>
                    {!isBlocked && (
                        <IonButton
                            fill="clear"
                            className={styles.camera}
                            onClick={onOpenVideoCall}
                            aria-label={
                                t('chat.video_call_aria_label', {
                                    name: partner.firstname,
                                }) as string
                            }
                        >
                            <IonIcon icon={videocam} />
                        </IonButton>
                    )}
                </div>
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
                                detail={false}
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
                            <IonItem button={true} detail={false} onClick={setSearchMode}>
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
                    onSearchIsEmpty={clearMessages}
                    clearSearch={unsetSearchMode}
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
                    setImageToDisplay={setImageToDisplay}
                />
            ) : (
                <div className={styles.loader}>
                    <Loader />
                </div>
            )}
            {!isSearchMode && (
                <ChatInputSender
                    isBlocked={isBlocked}
                    conversation={conversation}
                    handleSendMessage={handleSendMessage}
                />
            )}
        </div>
    );
};

const ChatContent: React.FC<ChatContentProps> = ({
    conversation,
    isHybrid,
    goBack,
    profile,
    setCurrentContent,
    setImageToDisplay,
}) => {
    if (!isHybrid) {
        return (
            <Content
                conversation={conversation}
                goBack={goBack}
                profile={profile}
                isHybrid={isHybrid}
                setCurrentContent={setCurrentContent}
                setImageToDisplay={setImageToDisplay}
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
                setImageToDisplay={setImageToDisplay}
            />
        </IonPage>
    );
};

export default ChatContent;
