import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import { Message } from '../../domain/entities/chat/Message';

const useGetMessagesFromConversation = () => {
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

    if (!profile) return messagesResult;

    const loadMessages = async () => {
        const messagesConversationResult = await getMessagesFromConversation.execute(profile.id, lastMessageId, 20);
        if (messagesConversationResult instanceof Error) {
            setMessagesResult({ messages: [], error: messagesConversationResult, isLoading: false });
        } else {
            setLastMessageId(messagesConversationResult[messagesConversationResult.length - 1].id);
            setMessagesResult({
                messages: [...messagesResult.messages, ...messagesConversationResult],
                error: undefined,
                isLoading: false,
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setMessagesResult({
                ...messagesResult,
                isLoading: true,
            });
            await loadMessages();
        };

        fetchData();
    }, [profile]);

    return { data: messagesResult, loadMessages };
};

export default useGetMessagesFromConversation;
