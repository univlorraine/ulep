import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import Report from '../../domain/entities/Report';
import { useStoreState } from '../../store/storeTypes';

const useGetReports = (refresh: boolean) => {
    const { getAllReports } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [reportsResult, setReportsResult] = useState<{
        reports: Report[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        reports: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return reportsResult;

    const userId = profile.user.id;

    useEffect(() => {
        const fetchData = async () => {
            setReportsResult({
                ...reportsResult,
                isLoading: true,
            });
            const result = await getAllReports.execute(userId);

            if (result instanceof Error) {
                setReportsResult({ reports: [], error: result, isLoading: false });
            } else {
                setReportsResult({ reports: result, error: undefined, isLoading: false });
            }
        };

        fetchData();
    }, [profile, refresh]);

    return reportsResult;
};

export default useGetReports;
