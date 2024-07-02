import { useDataProvider } from 'react-admin';
import { useMutation } from 'react-query';

interface UseCreateTandemParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

const useCreateTandem = (options?: UseCreateTandemParams) => {
    const dataProvider = useDataProvider();

    const { mutate, isLoading, isError } = useMutation(
        (props: { learningLanguageIds: string[]; relaunch?: boolean }) =>
            dataProvider.createTandem(props.learningLanguageIds, props.relaunch),
        options
    );

    return { mutate, isLoading, isError };
};

export default useCreateTandem;
