import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { Message } from '../../domain/entities/chat/Message';
import { useStoreState } from '../../store/storeTypes';

const useHandleMessagesFromConversation = (conversationId: string) => {
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

    if (!profile) return { ...messagesResult, loadMessages: () => {}, addNewMessage: () => {} };

    const addNewMessage = (message: Message) => {
        setMessagesResult((current) => ({
            messages: [message, ...current.messages],
            error: undefined,
            isLoading: false,
        }));
    };

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

    return { ...messagesResult, loadMessages, addNewMessage };
};

export default useHandleMessagesFromConversation;
