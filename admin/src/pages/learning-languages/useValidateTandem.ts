import { useDataProvider } from 'react-admin';
import { useMutation } from 'react-query';

interface UseValidateTandemParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

// TODO(NOW+2): rename validate into more appropriate when appariement mode will be in place

const useValidateTandem = (options?: UseValidateTandemParams) => {
    const dataProvider = useDataProvider();

    const { mutate, isLoading, isError } = useMutation(
        (tandemId: string) => dataProvider.validateTandem(tandemId),
        options
    );

    return { mutate, isLoading, isError };
};

export default useValidateTandem;
