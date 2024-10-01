import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { ActivityThemeCategory } from '../../domain/entities/Activity';
import { useStoreState } from '../../store/storeTypes';

const useGetActivityThemes = () => {
    const { getActivityThemes } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [activityThemesResult, setActivityThemesResult] = useState<{
        activityThemes: ActivityThemeCategory[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        activityThemes: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return activityThemesResult;

    useEffect(() => {
        const fetchData = async () => {
            setActivityThemesResult({
                ...activityThemesResult,
                isLoading: true,
            });
            const activityThemes = await getActivityThemes.execute();
            if (activityThemes instanceof Error) {
                setActivityThemesResult({ activityThemes: [], error: activityThemes, isLoading: false });
            } else {
                setActivityThemesResult({ activityThemes, error: undefined, isLoading: false });
            }
        };

        fetchData();
    }, [profile]);

    return activityThemesResult;
};

export default useGetActivityThemes;
