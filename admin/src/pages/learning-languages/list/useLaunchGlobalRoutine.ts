import { useDataProvider } from 'react-admin';
import { useMutation } from 'react-query';

interface UseLaunchGlobalRoutineOptions {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

const useLaunchGlobalRoutine = (options?: UseLaunchGlobalRoutineOptions) => {
    const dataProvider = useDataProvider();

    const { mutate, isLoading, isError } = useMutation(
        (universityIds: string[]) => dataProvider.launchGlobalRoutine(universityIds),
        options
    );

    return { mutate, isLoading, isError };
};

export default useLaunchGlobalRoutine;
