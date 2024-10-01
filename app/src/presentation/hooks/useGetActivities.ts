import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { Activity } from '../../domain/entities/Activity';
import {
    DEFAULT_ACTIVITIES_PAGE_SIZE,
    GetActivitiesFilters,
} from '../../domain/interfaces/activity/GetActivitiesUsecase.interface';
import { useStoreState } from '../../store/storeTypes';

const useGetActivity = (filters: Omit<GetActivitiesFilters, 'page'>) => {
    const { getActivities } = useConfig();
    const [page, setPage] = useState<number>(1);
    const [isPaginationEnded, setIsPaginationEnded] = useState<boolean>(false);
    const profile = useStoreState((state) => state.profile);

    const [activitiesResult, setactivitiesResult] = useState<{
        activities: Activity[];
        error: Error | undefined;
        isLoading: boolean;
        handleOnEndReached: () => void;
    }>({
        activities: [],
        error: undefined,
        isLoading: false,
        handleOnEndReached: () => {},
    });

    if (!profile) return activitiesResult;

    const handleOnEndReached = async () => {
        setPage(page + 1);
    };

    useEffect(() => {
        const fetchData = async () => {
            setactivitiesResult({
                ...activitiesResult,
                isLoading: true,
            });
            const activities = await getActivities.execute({ ...filters, page });
            if (activities instanceof Error) {
                setactivitiesResult({
                    activities: [],
                    error: activities,
                    isLoading: false,
                    handleOnEndReached,
                });
            } else {
                setIsPaginationEnded(activities.length < DEFAULT_ACTIVITIES_PAGE_SIZE);
                setactivitiesResult({
                    activities: [...activitiesResult.activities, ...activities],
                    error: undefined,
                    isLoading: false,
                    handleOnEndReached,
                });
            }
        };

        if (page > 1 && !isPaginationEnded) {
            fetchData();
        }
    }, [page]);

    useEffect(() => {
        const fetchData = async () => {
            setactivitiesResult({
                ...activitiesResult,
                isLoading: true,
            });
            const activities = await getActivities.execute({ ...filters, page: 1 });
            if (activities instanceof Error) {
                setactivitiesResult({
                    activities: [],
                    error: activities,
                    isLoading: false,
                    handleOnEndReached,
                });
            } else {
                setIsPaginationEnded(activities.length < DEFAULT_ACTIVITIES_PAGE_SIZE);
                setactivitiesResult({
                    activities: activities,
                    error: undefined,
                    isLoading: false,
                    handleOnEndReached,
                });
            }
            setPage(1);
        };

        fetchData();
    }, [profile, filters.activityTheme, filters.isMe, filters.language, filters.proficiency, filters.searchTitle]);

    return activitiesResult;
};

export default useGetActivity;
