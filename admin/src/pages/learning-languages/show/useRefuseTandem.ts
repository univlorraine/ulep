import { useDataProvider } from 'react-admin';
import { useMutation } from 'react-query';

interface UseRefuseTandemParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

const useRefuseTandem = (options?: UseRefuseTandemParams) => {
    const dataProvider = useDataProvider();

    const { mutate, isLoading, isError } = useMutation(
        (learningLanguageIds: string[]) => dataProvider.refuseTandem(learningLanguageIds),
        options
    );

    return { mutate, isLoading, isError };
};

export default useRefuseTandem;
