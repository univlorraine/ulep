import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { Activity } from '../../domain/entities/Activity';
import { useStoreState } from '../../store/storeTypes';

const useGetActivity = (activityId: string, refreshActivity: boolean) => {
    const { getActivity } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [activityResult, setActivityResult] = useState<{
        activity: Activity | undefined;
        error: Error | undefined;
        isLoading: boolean;
    }>({
        activity: undefined,
        error: undefined,
        isLoading: false,
    });

    if (!profile) return activityResult;

    useEffect(() => {
        const fetchData = async () => {
            setActivityResult({
                ...activityResult,
                isLoading: true,
            });
            const result = await getActivity.execute(activityId);
            if (result instanceof Error) {
                setActivityResult({ activity: undefined, error: result, isLoading: false });
            } else {
                setActivityResult({ activity: result, error: undefined, isLoading: false });
            }
        };

        fetchData();
    }, [profile, refreshActivity]);

    return activityResult;
};

export default useGetActivity;
