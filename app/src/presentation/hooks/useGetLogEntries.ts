import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { LogEntriesByDatesProps } from '../../domain/entities/LogEntry';
import { useStoreState } from '../../store/storeTypes';

const useGetLogEntries = (refresh: boolean) => {
    const { getLogEntries } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [logEntriesResult, setLogEntriesResult] = useState<{
        logEntries: LogEntriesByDatesProps[];
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
            const result = await getLogEntries.execute(profile.user.id);
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
    }, [profile, refresh]);

    return logEntriesResult;
};

export default useGetLogEntries;
