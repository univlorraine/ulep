import { useDataProvider, useNotify } from 'react-admin';
import { useMutation } from 'react-query';

interface UseGenerateEditosParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

const useGenerateEditos = (options?: UseGenerateEditosParams) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();

    const { mutate, isLoading, isError } = useMutation(dataProvider.generateEditos, options);

    if (isError) {
        notify('generateEditos.error');
    }

    return { mutate, isLoading, isError };
};

export default useGenerateEditos;
