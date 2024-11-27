import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { LogEntry } from '../../domain/entities/LogEntry';
import { useStoreState } from '../../store/storeTypes';

const useGetLogEntriesByDate = (date: Date) => {
    const { getLogEntriesByDate } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [logEntriesResult, setLogEntriesResult] = useState<{
        logEntries: LogEntry[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        logEntries: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return logEntriesResult;

    useEffect(() => {
        const fetchData = async () => {
            setLogEntriesResult({
                ...logEntriesResult,
                isLoading: true,
            });
            const result = await getLogEntriesByDate.execute(profile.user.id, date);
            if (result instanceof Error) {
                return setLogEntriesResult({ logEntries: [], error: result, isLoading: false });
            }

            setLogEntriesResult({
                logEntries: result,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [profile, date]);

    return logEntriesResult;
};

export default useGetLogEntriesByDate;
