/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import {
    IonButton,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonPopover,
    useIonToast,
} from '@ionic/react';
import { arrowBackOutline, downloadOutline, imageOutline, searchOutline, videocam } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { KebabSvg, LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { useSocket } from '../../../context/SocketContext';
import { Activity } from '../../../domain/entities/Activity';
import Conversation, { MessagePaginationDirection } from '../../../domain/entities/chat/Conversation';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import { useStoreState } from '../../../store/storeTypes';
import { useAppVisibilityRefresh } from '../../hooks/useAppVisibilityRefresh';
import useHandleHastagsFromConversation from '../../hooks/useHandleHastagsFromConversation';
import useHandleMessagesFromConversation from '../../hooks/useHandleMessagesFromConversation';
import ChatInputSender from '../chat/ChatInputSender';
import ConversationSearchBar from '../chat/ConversationSearchBar';
import MessageComponent from '../chat/MessageComponent';
import MessagesList from '../chat/MessagesList';
import Loader from '../Loader';
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
    const [showToast] = useIonToast();
    const {
        getVocabularyLists,
        getActivities,
        recorderAdapter,
        refreshTokensUsecase,
        exportMediasFromConversation,
        fileAdapter,
        deviceAdapter,
    } = useConfig();
    const isBlocked = conversation.isBlocked;
    const [showMenu, setShowMenu] = useState(false);
    const [currentMessageSearchId, setCurrentMessageSearchId] = useState<string>();
    const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
    const [vocabularyLists, setVocabularyLists] = useState<VocabularyList[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const history = useHistory();
    const accessToken = useStoreState((state) => state.accessToken);
    const isCommunity = conversation.isForCommunity;

    // Hook pour rafraîchir la page sur mobile quand l'app revient au premier plan
    useAppVisibilityRefresh();

    const findLearningLanguageConversation = () => {
        const profileLearningLanguages = profile.learningLanguages;
        const conversationLearningLanguages = conversation.learningLanguages;
        for (const profileLearningLanguage of profileLearningLanguages) {
            if (conversationLearningLanguages?.some((language) => language.id === profileLearningLanguage.id)) {
                return profileLearningLanguage;
            }
        }
    };

    const findLearningLanguageCommunityConversation = () => {
        const profileLearningLanguages = profile.learningLanguages;
        return (
            profileLearningLanguages.find((language) => language.code === conversation.centralLanguage?.code) ||
            profileLearningLanguages.find((language) => language.code === conversation.partnerLanguage?.code)
        );
    };

    const {
        messages,
        handleSendMessage,
        isScrollForwardOver,
        isScrollBackwardOver,
        isLoading,
        onLoadMessages,
        addNewMessage,
        clearMessages,
        onLikeMessage,
        onUnlikeMessage,
        onLikeMessageReceived,
        onUnlikeMessageReceived,
        onReplyToMessage,
        onCancelReply,
        messageToReply,
    } = useHandleMessagesFromConversation({
        conversationId: conversation.id,
        learningLanguageId: findLearningLanguageConversation()?.id,
    });

    const { hashtags, isLoading: hashtagsLoading } = useHandleHastagsFromConversation({
        conversationId: conversation.id,
        messages,
    });

    const partner = Conversation.getMainConversationPartner(conversation, profile.user.id);
    let disconnectInterval: NodeJS.Timeout | undefined;

    const setSearchMode = () => {
        setShowMenu(false);
        setIsSearchMode(true);
    };

    const unsetSearchMode = () => {
        setIsSearchMode(false);
        setCurrentMessageSearchId(undefined);
        onLoadMessages({ isFirstMessage: true, direction: MessagePaginationDirection.FORWARD });
    };

    const loadMessageFromSearch = (messageId: string) => {
        setCurrentMessageSearchId(messageId);
        onLoadMessages({ isFirstMessage: true, direction: MessagePaginationDirection.BOTH, messageId });
    };

    const onOpenVideoCall = () => {
        if (isCommunity) {
            return;
        }

        const conversationLearningLanguage = findLearningLanguageConversation();
        history.push({
            pathname: '/jitsi',
            search: `?roomName=${conversation.id}`,
            state: { tandemPartner: partner, learningLanguageId: conversationLearningLanguage?.id },
        });
    };

    const handleExportMedias = async () => {
        const response = await exportMediasFromConversation.execute(conversation.id);

        if (response instanceof Error) {
            console.error(response);
            setShowMenu(false);
            return;
        }

        const firstName = profile.user.firstname.replace(' ', '_');
        const lastName = profile.user.lastname.replace(' ', '_');

        await fileAdapter.saveBlob(
            response,
            `${firstName}-${lastName}-export-medias-${findLearningLanguageConversation()?.code}.zip`
        );
        setShowMenu(false);
        showToast({
            message: t('chat.fileDownloaded'),
            duration: 2000,
        });
    };

    useEffect(() => {
        recorderAdapter.requestPermission();
        socket.connect(accessToken);
        socket.onMessage(conversation.id, addNewMessage);
        socket.onLiked(conversation.id, onLikeMessageReceived);
        socket.onUnliked(conversation.id, onUnlikeMessageReceived);

        // Ancien système de reconnexion manuelle - SEULEMENT pour le web
        if (!deviceAdapter.isNativePlatform()) {
            const refreshTokens = async () => {
                await refreshTokensUsecase.execute();
            };

            const attemptReconnect = async () => {
                if (!socket.isConnected()) {
                    await refreshTokens();
                    socket.connect(accessToken);
                    await onLoadMessages({ isFirstMessage: true });
                } else {
                    if (disconnectInterval) {
                        clearInterval(disconnectInterval);
                        disconnectInterval = undefined;
                    }
                }
            };

            const handleDisconnect = () => {
                disconnectInterval = setInterval(attemptReconnect, 5000);
            };

            socket.onDisconnect(handleDisconnect);

            return () => {
                socket.disconnect();
                socket.offMessage();
                socket.offDisconnect();
                socket.offLike();
                socket.offUnlike();
                if (disconnectInterval) {
                    clearInterval(disconnectInterval);
                }
            };
        } else {
            // Sur mobile : pas de reconnexion manuelle, on laisse socket.io gérer
            return () => {
                socket.disconnect();
                socket.offMessage();
                socket.offDisconnect();
                socket.offLike();
                socket.offUnlike();
            };
        }
    }, [conversation.id, accessToken, deviceAdapter]);

    const getAllVocabularyLists = async () => {
        const learningLanguage = findLearningLanguageCommunityConversation();
        if (!learningLanguage) {
            return;
        }

        const result = await getVocabularyLists.execute(profile.id, learningLanguage.code);
        if (result instanceof Error) {
            showToast(result.message, 3000);
        } else {
            setVocabularyLists(result);
        }
    };

    const getAllActivities = async () => {
        const learningLanguage = findLearningLanguageCommunityConversation();
        if (!learningLanguage || !conversation.centralLanguage || !conversation.partnerLanguage) {
            return;
        }

        const result = await getActivities.execute({
            language: [conversation.centralLanguage, conversation.partnerLanguage],
            shouldTakeAllMine: true,
            page: 1,
            proficiency: [],
            activityTheme: [],
        });
        if (result instanceof Error) {
            showToast(result.message, 3000);
        } else {
            setActivities(result);
        }
    };

    useEffect(() => {
        if (conversation.isForCommunity) {
            getAllVocabularyLists();
            getAllActivities();
        }

        return () => {
            setVocabularyLists([]);
            setActivities([]);
        };
    }, [conversation.id, profile.id]);

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
                    <h1 className={styles.title}>
                        {!isCommunity
                            ? t('chat.title', {
                                  name: partner.firstname,
                              })
                            : t('chat.community.name', {
                                  firstLanguage: t(`languages_code.${conversation.centralLanguage?.code}`),
                                  secondLanguage: t(`languages_code.${conversation.partnerLanguage?.code}`),
                              })}
                    </h1>
                    {!isBlocked && !isCommunity && (
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
                    aria-label={
                        t('chat.conversation_menu.aria_label', {
                            name: partner.firstname,
                        }) as string
                    }
                >
                    <IonIcon icon={KebabSvg} size="medium" aria-hidden="true" />
                </IonButton>
                <IonPopover trigger="click-trigger" triggerAction="click" isOpen={showMenu} showBackdrop={false}>
                    <IonContent>
                        <IonList lines="none">
                            {!isCommunity && (
                                <IonItem
                                    aria-label={t('chat.conversation_menu.medias') as string}
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
                            )}
                            <IonItem
                                aria-label={t('chat.conversation_menu.export_medias') as string}
                                button={true}
                                detail={false}
                                onClick={handleExportMedias}
                            >
                                <IonIcon icon={downloadOutline} aria-hidden="true" />
                                <IonLabel className={styles['chat-popover-label']}>
                                    {t('chat.conversation_menu.export_medias')}
                                </IonLabel>
                            </IonItem>
                            <IonItem
                                aria-label={t('chat.conversation_menu.search') as string}
                                button={true}
                                detail={false}
                                onClick={setSearchMode}
                            >
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
            {messageToReply && (
                <div className={styles.replyHeader}>
                    <IonButton
                        aria-label={t('chat.goBackToConversation') as string}
                        fill="clear"
                        onClick={onCancelReply}
                        className={styles.replyHeaderButton}
                    >
                        <IonIcon color="black" icon={arrowBackOutline} />
                        <span className={styles.replyHeaderText}>{t('chat.goBackToConversation')}</span>
                    </IonButton>
                    <MessageComponent
                        message={messageToReply}
                        isCurrentUserMessage={messageToReply.isMine(profile.user.id)}
                        isCommunity
                        isInReply
                        hideContextMenu
                    />
                </div>
            )}
            {!isLoading ? (
                <MessagesList
                    currentMessageSearchId={currentMessageSearchId}
                    messages={messages}
                    loadMessages={(direction) => onLoadMessages({ isFirstMessage: false, direction })}
                    onLikeMessage={onLikeMessage}
                    onUnlikeMessage={onUnlikeMessage}
                    onReplyToMessage={onReplyToMessage}
                    userId={profile.user.id}
                    isScrollForwardOver={isScrollForwardOver}
                    isScrollBackwardOver={isScrollBackwardOver}
                    setImageToDisplay={setImageToDisplay}
                    isCommunity={isCommunity}
                    messageToReply={messageToReply}
                    onCancelReply={onCancelReply}
                />
            ) : (
                <div className={styles.loader}>
                    <Loader />
                </div>
            )}
            {!isSearchMode && (
                <ChatInputSender
                    hashtags={hashtags}
                    isHastagsLoading={hashtagsLoading}
                    searchHashtag={(hashtag) => onLoadMessages({ isFirstMessage: true, hashtagToFilter: hashtag })}
                    isReplayMode={Boolean(messageToReply)}
                    isBlocked={isBlocked}
                    isCommunity={isCommunity}
                    conversation={conversation}
                    handleSendMessage={handleSendMessage}
                    vocabularyLists={vocabularyLists}
                    activities={activities}
                    profile={profile}
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
