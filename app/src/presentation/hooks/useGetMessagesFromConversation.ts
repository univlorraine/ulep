import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import { Message } from '../../domain/entities/chat/Message';

const useGetMessagesFromConversation = (conversationId: string) => {
    const { getMessagesFromConversation } = useConfig();
    const [lastMessageId, setLastMessageId] = useState<string>();
    const profile = useStoreState((state) => state.profile);

    const [messagesResult, setMessagesResult] = useState<{
        messages: Message[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        messages: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return { ...messagesResult, loadMessages: () => {} };

    const loadMessages = async () => {
        const messagesConversationResult = await getMessagesFromConversation.execute(conversationId, lastMessageId, 20);
        if (messagesConversationResult instanceof Error) {
            return setMessagesResult({ messages: [], error: messagesConversationResult, isLoading: false });
        }

        if (messagesConversationResult.length > 0) {
            setLastMessageId(messagesConversationResult[messagesConversationResult.length - 1].id);
            setMessagesResult({
                messages: [...messagesResult.messages, ...messagesConversationResult],
                error: undefined,
                isLoading: false,
            });
        }
    };

    const loadFirstMessages = async () => {
        const messagesConversationResult = await getMessagesFromConversation.execute(conversationId);
        if (messagesConversationResult instanceof Error) {
            return setMessagesResult({ messages: [], error: messagesConversationResult, isLoading: false });
        }

        if (messagesConversationResult.length > 0) {
            setLastMessageId(messagesConversationResult[messagesConversationResult.length - 1].id);
        }
        setMessagesResult({
            messages: messagesConversationResult,
            error: undefined,
            isLoading: false,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            setMessagesResult({
                ...messagesResult,
                isLoading: true,
            });
            await loadFirstMessages();
        };

        fetchData();
    }, [profile, conversationId]);

    return { ...messagesResult, loadMessages };
};

export default useGetMessagesFromConversation;
