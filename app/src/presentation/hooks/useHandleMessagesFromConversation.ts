import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { MessagePaginationDirection } from '../../domain/entities/chat/Conversation';
import { Message, MessageType } from '../../domain/entities/chat/Message';
import { useStoreState } from '../../store/storeTypes';

interface UseHandleMessagesFromConversationProps {
    conversationId: string;
    typeFilter?: MessageType;
    limit?: number;
}

const useHandleMessagesFromConversation = ({
    conversationId,
    typeFilter,
    limit = 10,
}: UseHandleMessagesFromConversationProps) => {
    const { getMessagesFromConversation } = useConfig();
    const [lastMessageForwardId, setLastMessageForwardId] = useState<string>();
    const [lastMessageBackwardId, setLastMessageBackwardId] = useState<string>();
    const profile = useStoreState((state) => state.profile);

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
        return { ...messagesResult, loadMessages: () => {}, addNewMessage: () => {}, clearMessages: () => {} };

    const addNewMessage = (message: Message) => {
        setMessagesResult((current) => ({
            messages: [message, ...current.messages],
            isScrollForwardOver: current.isScrollForwardOver,
            isScrollBackwardOver: current.isScrollBackwardOver,
            error: undefined,
            isLoading: false,
        }));
    };

    const loadMessages = async (
        isFirstMessage = false,
        direction: MessagePaginationDirection = MessagePaginationDirection.FORWARD,
        messageId?: string
    ) => {
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
        const fetchData = async () => {
            await loadMessages(true);
        };

        fetchData();
    }, [profile, conversationId, typeFilter]);

    return { ...messagesResult, loadMessages, addNewMessage, clearMessages };
};

export default useHandleMessagesFromConversation;
