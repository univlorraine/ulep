import { useDataProvider, useNotify } from 'react-admin';
import { useMutation } from 'react-query';

interface UsePurgeParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

const usePurge = (options?: UsePurgeParams) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();

    const { mutate, isLoading, isError } = useMutation(dataProvider.purge, options);

    if (isError) {
        notify('purge.error');
    }

    return { mutate, isLoading, isError };
};

export default usePurge;
