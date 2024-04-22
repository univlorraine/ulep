import { useDataProvider } from 'react-admin';
import { useMutation } from 'react-query';
import { TandemStatus } from '../../../../entities/Tandem';

interface UseUpdateTandemParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

const useUpdateTandem = (options?: UseUpdateTandemParams) => {
    const dataProvider = useDataProvider();

    const { mutate, isLoading, isError } = useMutation(
        (props: { tandemId: string; tandemStatus: TandemStatus }) =>
            dataProvider.updateTandem(props.tandemId, props.tandemStatus),
        options
    );

    return { mutate, isLoading, isError };
};

export default useUpdateTandem;
