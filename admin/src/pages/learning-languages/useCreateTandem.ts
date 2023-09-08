import { useDataProvider } from 'react-admin';
import { useMutation } from 'react-query';

interface UseCreateTandemParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

// TODO(NOW+2): rename create into more appropriate when appariement mode will be in place

const useCreateTandem = (options?: UseCreateTandemParams) => {
    const dataProvider = useDataProvider();

    const { mutate, isLoading, isError } = useMutation(
        (learningLanguageIds: string[]) => dataProvider.createTandem(learningLanguageIds),
        options
    );

    return { mutate, isLoading, isError };
};

export default useCreateTandem;
