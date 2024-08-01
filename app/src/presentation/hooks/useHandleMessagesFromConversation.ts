import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
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
    const [lastMessageId, setLastMessageId] = useState<string>();
    const profile = useStoreState((state) => state.profile);

    const [messagesResult, setMessagesResult] = useState<{
        messages: Message[];
        isScrollOver: boolean;
        error: Error | undefined;
        isLoading: boolean;
    }>({
        messages: [],
        isScrollOver: false,
        error: undefined,
        isLoading: false,
    });

    if (!profile) return { ...messagesResult, loadMessages: () => {}, addNewMessage: () => {} };

    const addNewMessage = (message: Message) => {
        setMessagesResult((current) => ({
            messages: [message, ...current.messages],
            isScrollOver: current.isScrollOver,
            error: undefined,
            isLoading: false,
        }));
    };

    const loadMessages = async (isFirstMessage = false) => {
        if (!isFirstMessage && messagesResult.isScrollOver) return;
        setMessagesResult({
            ...messagesResult,
            isLoading: isFirstMessage, // Reload conversation only if it's the first message
        });
        const messagesConversationResult = await getMessagesFromConversation.execute(conversationId, {
            lastMessageId: isFirstMessage ? undefined : lastMessageId,
            limit,
            typeFilter,
        });
        if (messagesConversationResult instanceof Error) {
            return setMessagesResult({
                messages: [],
                error: messagesConversationResult,
                isLoading: false,
                isScrollOver: false,
            });
        }

        if (messagesConversationResult.length > 0) {
            setLastMessageId(messagesConversationResult[messagesConversationResult.length - 1].id);
        }

        setMessagesResult({
            messages: isFirstMessage
                ? messagesConversationResult
                : [...messagesResult.messages, ...messagesConversationResult],
            error: undefined,
            isLoading: false,
            isScrollOver: messagesConversationResult.length < 10,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            await loadMessages(true);
        };

        fetchData();
    }, [profile, conversationId, typeFilter]);

    return { ...messagesResult, loadMessages, addNewMessage };
};

export default useHandleMessagesFromConversation;
