import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import Hashtag from '../../domain/entities/chat/Hashtag';
import { useStoreState } from '../../store/storeTypes';

interface UseHandleHastagsFromConversationProps {
    conversationId: string;
}

const useHandleHastagsFromConversation = ({ conversationId }: UseHandleHastagsFromConversationProps) => {
    const { getHashtagsFromConversation } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [hashtagsResult, setHashtagsResult] = useState<{
        hashtags: Hashtag[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        hashtags: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return hashtagsResult;

    const onLoadHashtags = async () => {
        const result = await getHashtagsFromConversation.execute(conversationId);

        if (result instanceof Error) {
            setHashtagsResult({ hashtags: [], error: result, isLoading: false });
        } else {
            setHashtagsResult({
                hashtags: result.sort((a, b) => b.numberOfUses - a.numberOfUses),
                error: undefined,
                isLoading: false,
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await onLoadHashtags();
        };

        fetchData();
    }, [profile, conversationId]);

    return { ...hashtagsResult };
};

export default useHandleHastagsFromConversation;
