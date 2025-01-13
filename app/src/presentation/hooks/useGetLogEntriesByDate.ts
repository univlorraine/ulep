import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { LogEntry } from '../../domain/entities/LogEntry';
import { DEFAULT_ACTIVITIES_PAGE_SIZE } from '../../domain/interfaces/activity/GetActivitiesUsecase.interface';
import { DEFAULT_LOG_ENTRIES_BY_DATE_PAGE_SIZE } from '../../domain/interfaces/log-entries/GetLogEntriesByDateUsecase.interface';
import { useStoreState } from '../../store/storeTypes';

const useGetLogEntriesByDate = (date: Date, learningLanguageId: string) => {
    const { getLogEntriesByDate } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const [page, setPage] = useState<number>(1);
    const [isPaginationEnded, setIsPaginationEnded] = useState<boolean>(false);

    const [logEntriesResult, setLogEntriesResult] = useState<{
        logEntries: LogEntry[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        logEntries: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return { logEntriesResult, isPaginationEnded, handleOnEndReached: undefined };

    const handleOnEndReached = async () => {
        setPage(page + 1);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLogEntriesResult({
                ...logEntriesResult,
                isLoading: true,
            });
            const logEntries = await getLogEntriesByDate.execute({
                userId: profile.user.id,
                date,
                learningLanguageId,
                page,
            });
            if (logEntries instanceof Error) {
                setLogEntriesResult({
                    logEntries: [],
                    error: logEntries,
                    isLoading: false,
                });
            } else {
                setIsPaginationEnded(logEntries.length < DEFAULT_ACTIVITIES_PAGE_SIZE);
                setLogEntriesResult({
                    logEntries: [...logEntriesResult.logEntries, ...logEntries],
                    error: undefined,
                    isLoading: false,
                });
            }
        };

        if (page > 1 && !isPaginationEnded) {
            fetchData();
        }
    }, [page]);

    useEffect(() => {
        const fetchData = async () => {
            setLogEntriesResult({
                ...logEntriesResult,
                isLoading: true,
            });
            const result = await getLogEntriesByDate.execute({
                userId: profile.user.id,
                date,
                learningLanguageId,
                page: 1,
            });
            if (result instanceof Error) {
                return setLogEntriesResult({ logEntries: [], error: result, isLoading: false });
            }
            setIsPaginationEnded(result.length < DEFAULT_LOG_ENTRIES_BY_DATE_PAGE_SIZE);
            setLogEntriesResult({
                logEntries: result,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [profile, date]);

    return { logEntriesResult, isPaginationEnded, handleOnEndReached };
};

export default useGetLogEntriesByDate;
