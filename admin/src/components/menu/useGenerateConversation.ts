import { useDataProvider, useNotify } from 'react-admin';
import { useMutation } from 'react-query';

interface UseGenerateConversationParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

const useGenerateConversation = (options?: UseGenerateConversationParams) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();

    const { mutate, isLoading, isError } = useMutation(dataProvider.generateConversations, options);

    if (isError) {
        notify('generateConversation.error');
    }

    return { mutate, isLoading, isError };
};

export default useGenerateConversation;
