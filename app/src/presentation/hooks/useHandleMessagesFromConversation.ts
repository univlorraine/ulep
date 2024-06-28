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

    const loadMessages = async () => {
        if (messagesResult.isScrollOver) return;
        setMessagesResult({
            ...messagesResult,
            isLoading: true,
        });
        const messagesConversationResult = await getMessagesFromConversation.execute(conversationId, lastMessageId, 10);
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
            messages: [...messagesResult.messages, ...messagesConversationResult],
            error: undefined,
            isLoading: false,
            isScrollOver: messagesConversationResult.length < 10,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            await loadMessages();
        };

        fetchData();
    }, [profile, conversationId]);

    return { ...messagesResult, loadMessages, addNewMessage };
};

export default useHandleMessagesFromConversation;
