import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import Conversation from '../../domain/entities/chat/Conversation';

const useGetConversations = () => {
    const { getConversations } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [conversationResult, setConversationResult] = useState<{
        conversations: Conversation[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        conversations: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return conversationResult;

    useEffect(() => {
        const fetchData = async () => {
            setConversationResult({
                ...conversationResult,
                isLoading: true,
            });
            const conversationsResult = await getConversations.execute(profile.id);
            if (conversationsResult instanceof Error) {
                setConversationResult({ conversations: [], error: conversationsResult, isLoading: false });
            } else {
                setConversationResult({ conversations: conversationsResult, error: undefined, isLoading: false });
            }
        };

        fetchData();
    }, [profile]);

    return conversationResult;
};

export default useGetConversations;
