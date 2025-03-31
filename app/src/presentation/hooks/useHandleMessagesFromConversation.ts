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

import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import { useSocket } from '../../context/SocketContext';
import Conversation, { MessagePaginationDirection } from '../../domain/entities/chat/Conversation';
import Hashtag from '../../domain/entities/chat/Hashtag';
import { Message, MessageType, MessageWithConversationId } from '../../domain/entities/chat/Message';
import { LogEntryType } from '../../domain/entities/LogEntry';
import { UserChat } from '../../domain/entities/User';
import { useStoreState } from '../../store/storeTypes';

type LoadMessageProps = {
    isFirstMessage: boolean;
    direction?: MessagePaginationDirection;
    messageId?: string;
    messageToReplyId?: string;
    hashtagToFilter?: Hashtag;
};

interface UseHandleMessagesFromConversationProps {
    conversationId: string;
    typeFilter?: MessageType;
    limit?: number;
    learningLanguageId?: string;
}

const useHandleMessagesFromConversation = ({
    conversationId,
    typeFilter,
    limit = 10,
    learningLanguageId,
}: UseHandleMessagesFromConversationProps) => {
    const { getMessagesFromConversation, sendMessage, createLogEntry } = useConfig();
    const { socket } = useSocket();
    const [lastMessageForwardId, setLastMessageForwardId] = useState<string>();
    const [lastMessageBackwardId, setLastMessageBackwardId] = useState<string>();
    const [currentMessageReply, setCurrentMessageReply] = useState<Message>();
    const profile = useStoreState((state) => state.profile);
    const [showToast] = useIonToast();
    const { t } = useTranslation();

    const [messagesResult, setMessagesResult] = useState<{
        messages: Message[];
        isScrollForwardOver: boolean;
        isScrollBackwardOver: boolean;
        error: Error | undefined;
        isLoading: boolean;
    }>({
        messages: [],
        isScrollForwardOver: false,
        isScrollBackwardOver: false,
        error: undefined,
        isLoading: false,
    });

    if (!profile)
        return {
            ...messagesResult,
            messageToReply: undefined,
            onLoadMessages: () => {},
            addNewMessage: () => {},
            clearMessages: () => {},
            handleSendMessage: () => {},
            onLikeMessage: () => {},
            onUnlikeMessage: () => {},
            onLikeMessageReceived: () => {},
            onUnlikeMessageReceived: () => {},
            onReplyToMessage: () => {},
            onCancelReply: () => {},
        };

    const onLoadMessages = (props: LoadMessageProps) => {
        const {
            isFirstMessage = false,
            direction = MessagePaginationDirection.FORWARD,
            messageId,
            hashtagToFilter,
        } = props;
        loadMessages({
            isFirstMessage,
            direction,
            messageId,
            messageToReplyId: currentMessageReply?.id,
            hashtagToFilter,
        });
    };

    const onReplyToMessage = async (message: Message) => {
        setCurrentMessageReply(message);
    };

    const onCancelReply = () => {
        setCurrentMessageReply(undefined);
    };

    const onLikeMessage = (messageId: string) => {
        const messageToLike = messagesResult.messages.find((message) => message.id === messageId);
        if (!messageToLike) {
            return;
        }
        messageToLike.likes++;
        messageToLike.didLike = true;
        socket.like(conversationId, messageId, profile.user.id);
    };

    const onUnlikeMessage = (messageId: string) => {
        const messageToUnlike = messagesResult.messages.find((message) => message.id === messageId);
        if (!messageToUnlike) {
            return;
        }
        messageToUnlike.likes--;
        messageToUnlike.didLike = false;
        socket.unlike(conversationId, messageId, profile.user.id);
    };

    const onLikeMessageReceived = (messageId: string, userId: string) => {
        if (userId === profile.user.id) {
            return;
        }

        setMessagesResult((current: any) => {
            const updatedMessages = current.messages.map((message: any) => {
                if (message.id === messageId) {
                    return new Message(
                        message.id,
                        message.content,
                        message.createdAt,
                        message.sender,
                        message.type,
                        message.likes + 1,
                        message.didLike,
                        message.metadata
                    );
                }
                return message;
            });

            return {
                ...current,
                messages: updatedMessages,
            };
        });
    };

    const onUnlikeMessageReceived = (messageId: string, userId: string) => {
        if (userId === profile.user.id) {
            return;
        }

        setMessagesResult((current: any) => {
            const updatedMessages = current.messages.map((message: any) => {
                if (message.id === messageId) {
                    return new Message(
                        message.id,
                        message.content,
                        message.createdAt,
                        message.sender,
                        message.type,
                        message.likes - 1,
                        message.didLike,
                        message.metadata
                    );
                }
                return message;
            });

            return {
                ...current,
                messages: updatedMessages,
            };
        });
    };

    const addNewMessage = (message: Message) => {
        if (!currentMessageReply || message.parentId === currentMessageReply?.id) {
            setMessagesResult((current) => ({
                messages: [message, ...current.messages],
                isScrollForwardOver: current.isScrollForwardOver,
                isScrollBackwardOver: current.isScrollBackwardOver,
                error: undefined,
                isLoading: false,
            }));
        }
    };

    const handleSendMessage = async (
        conversation: Conversation,
        message: string,
        file?: File,
        filename?: string,
        type?: MessageType,
        metadata?: any
    ) => {
        const messageResult = await sendMessage.execute({
            conversationId: conversation.id,
            senderId: profile.user.id,
            content: message,
            file,
            filename,
            type,
            parentId: currentMessageReply?.id,
        });

        if (messageResult instanceof Error) {
            return showToast({
                message: t(messageResult.message),
                duration: 5000,
            });
        }

        socket.emit(
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
                conversation.id,
                0,
                false,
                { ...messageResult.metadata, ...metadata },
                0,
                false,
                currentMessageReply?.id
            )
        );

        const partner = Conversation.getMainConversationPartner(conversation, profile.user.id);

        if (learningLanguageId) {
            await createLogEntry.execute({
                type: LogEntryType.TANDEM_CHAT,
                learningLanguageId,
                metadata: {
                    partnerTandemId: conversation.id,
                    tandemFirstname: partner.firstname,
                    tandemLastname: partner.lastname,
                },
            });
        }
    };

    const loadMessages = async (props: LoadMessageProps) => {
        const { isFirstMessage, direction, messageId, messageToReplyId, hashtagToFilter } = props;
        if (
            (!isFirstMessage &&
                direction === MessagePaginationDirection.FORWARD &&
                messagesResult.isScrollForwardOver) ||
            (direction === MessagePaginationDirection.BACKWARD && messagesResult.isScrollBackwardOver)
        )
            return;

        setMessagesResult({
            ...messagesResult,
            isLoading: isFirstMessage, // Reload conversation only if it's the first message
        });

        let lastMessageId;
        // If we are in search mode
        if (isFirstMessage && messageId) {
            lastMessageId = messageId;
            // If we are in normal mode with forward and backward
        } else if (!isFirstMessage && !messageId) {
            lastMessageId =
                direction === MessagePaginationDirection.FORWARD ? lastMessageForwardId : lastMessageBackwardId;
        }

        const messagesConversationResult = await getMessagesFromConversation.execute(conversationId, {
            lastMessageId,
            limit,
            typeFilter,
            direction,
            parentId: messageToReplyId,
            hashtagFilter: hashtagToFilter ? `${hashtagToFilter.name}` : undefined,
        });

        if (messagesConversationResult instanceof Error) {
            return setMessagesResult({
                messages: [],
                error: messagesConversationResult,
                isLoading: false,
                isScrollForwardOver: false,
                isScrollBackwardOver: false,
            });
        }

        if (messagesConversationResult.length > 0) {
            if (direction === MessagePaginationDirection.FORWARD) {
                setLastMessageForwardId(messagesConversationResult[messagesConversationResult.length - 1].id);
            } else if (direction === MessagePaginationDirection.BACKWARD) {
                setLastMessageBackwardId(messagesConversationResult[0].id);
            } else {
                setLastMessageForwardId(messagesConversationResult[messagesConversationResult.length - 1].id);
                setLastMessageBackwardId(messagesConversationResult[0].id);
            }
        }

        if (direction === MessagePaginationDirection.BACKWARD) {
            setMessagesResult({
                messages: isFirstMessage
                    ? messagesConversationResult
                    : [...messagesConversationResult, ...messagesResult.messages],
                error: undefined,
                isLoading: false,
                isScrollBackwardOver: messagesConversationResult.length < limit,
                isScrollForwardOver: false,
            });
        } else if (direction === MessagePaginationDirection.FORWARD) {
            setMessagesResult({
                messages: isFirstMessage
                    ? messagesConversationResult
                    : [...messagesResult.messages, ...messagesConversationResult],
                error: undefined,
                isLoading: false,
                isScrollForwardOver: messagesConversationResult.length < limit,
                isScrollBackwardOver: false,
            });
        } else if (direction === MessagePaginationDirection.BOTH) {
            //Info: isScrollForwardOver and isScrollBackwardOver are set to false because we are loading messages from both directions
            //Info: we cannot know if we are before the limit of messages on forward or backward, so we set to false
            setMessagesResult({
                messages: messagesConversationResult,
                error: undefined,
                isLoading: false,
                isScrollForwardOver: false,
                isScrollBackwardOver: false,
            });
        }
    };

    const clearMessages = () => {
        setLastMessageForwardId(undefined);
        setLastMessageBackwardId(undefined);
        setMessagesResult({
            messages: [],
            error: undefined,
            isLoading: false,
            isScrollForwardOver: false,
            isScrollBackwardOver: false,
        });
    };

    useEffect(() => {
        setCurrentMessageReply(undefined);
    }, [conversationId]);

    useEffect(() => {
        const fetchData = async () => {
            await onLoadMessages({ isFirstMessage: true });
        };

        fetchData();
    }, [profile, conversationId, typeFilter, currentMessageReply]);

    return {
        ...messagesResult,
        messageToReply: currentMessageReply,
        onLoadMessages,
        addNewMessage,
        clearMessages,
        handleSendMessage,
        onLikeMessage,
        onUnlikeMessage,
        onLikeMessageReceived,
        onUnlikeMessageReceived,
        onReplyToMessage,
        onCancelReply,
    };
};

export default useHandleMessagesFromConversation;
