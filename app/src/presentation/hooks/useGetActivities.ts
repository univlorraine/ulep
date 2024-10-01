import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { Activity } from '../../domain/entities/Activity';
import { GetActivitiesFilters } from '../../domain/interfaces/activity/GetActivitiesUsecase.interface';
import { useStoreState } from '../../store/storeTypes';

const useGetActivity = (filters: GetActivitiesFilters) => {
    const { getActivities } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [activityResult, setActivityResult] = useState<{
        activities: Activity[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        activities: [],
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
            const activities = await getActivities.execute(filters);
            if (activities instanceof Error) {
                setActivityResult({ activities: [], error: activities, isLoading: false });
            } else {
                setActivityResult({ activities: activities, error: undefined, isLoading: false });
            }
        };

        fetchData();
    }, [
        profile,
        filters.activityTheme,
        filters.isMe,
        filters.language,
        filters.proficiency,
        filters.searchTitle,
        filters.page,
    ]);

    return activityResult;
};

export default useGetActivity;
