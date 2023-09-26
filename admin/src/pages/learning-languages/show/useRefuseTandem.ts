import { useDataProvider } from 'react-admin';
import { useMutation } from 'react-query';

interface UseRefuseTandemParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

const useRefuseTandem = (options?: UseRefuseTandemParams) => {
    const dataProvider = useDataProvider();

    const { mutate, isLoading, isError } = useMutation(
        (props: { learningLanguageIds: string[]; relaunch?: boolean }) =>
            dataProvider.refuseTandem(props.learningLanguageIds, props.relaunch),
        options
    );

    return { mutate, isLoading, isError };
};

export default useRefuseTandem;
