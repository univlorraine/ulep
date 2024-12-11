import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { LogEntriesByDatesProps } from '../../domain/entities/LogEntry';
import { DEFAULT_LOG_ENTRIES_BY_DATE_PAGE_SIZE } from '../../domain/interfaces/log-entries/GetLogEntriesByDateUsecase.interface';
import { useStoreState } from '../../store/storeTypes';

const useGetLogEntries = (learningLanguageId: string, refresh: boolean) => {
    const { getLogEntries } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const [page, setPage] = useState<number>(1);
    const [isPaginationEnded, setIsPaginationEnded] = useState<boolean>(false);

    const [logEntriesResult, setLogEntriesResult] = useState<{
        logEntries: LogEntriesByDatesProps[];
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
            const result = await getLogEntries.execute({
                userId: profile.user.id,
                learningLanguageId,
                page,
            });
            if (result instanceof Error) {
                return setLogEntriesResult({ logEntries: [], error: result, isLoading: false });
            }

            setIsPaginationEnded(result.length < DEFAULT_LOG_ENTRIES_BY_DATE_PAGE_SIZE);
            setLogEntriesResult({
                logEntries: [...logEntriesResult.logEntries, ...result],
                error: undefined,
                isLoading: false,
            });
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
            const result = await getLogEntries.execute({
                userId: profile.user.id,
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
    }, [profile, refresh]);

    return { logEntriesResult, isPaginationEnded, handleOnEndReached };
};

export default useGetLogEntries;
