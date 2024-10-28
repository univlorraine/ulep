import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import EventObject, { EventType } from '../../domain/entities/Event';
import Language from '../../domain/entities/Language';
import { DEFAULT_NEWS_PAGE_SIZE } from '../../domain/interfaces/news/GetAllNewsUsecase.interface';
import { useStoreState } from '../../store/storeTypes';

const useGetEventsList = (languageFilter: Language[], typeFilter: EventType[]) => {
    const { getAllEvents } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [isEventsListEnded, setIsEventsListEnded] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    const [eventsResult, setEventsResult] = useState<{
        events: EventObject[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        events: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile)
        return {
            ...eventsResult,
            searchTitle: '',
            isEventsListEnded,
            setSearchTitle: () => {},
            onLoadMoreEvents: () => {},
        };

    const onLoadMoreEvents = () => {
        setPage(page + 1);
    };

    useEffect(() => {
        const fetchData = async () => {
            setEventsResult({
                ...eventsResult,
                isLoading: true,
            });
            const result = await getAllEvents.execute({
                title: searchTitle,
                page,
                types: typeFilter,
                languageCodes: languageFilter.map((language) => language.code),
            });
            if (result instanceof Error) {
                return setEventsResult({
                    ...eventsResult,
                    events: [],
                    error: result,
                    isLoading: false,
                });
            }

            if (result.length < DEFAULT_NEWS_PAGE_SIZE) {
                setIsEventsListEnded(true);
            }

            setEventsResult({
                ...eventsResult,
                events: [...eventsResult.events, ...result],
                error: undefined,
                isLoading: false,
            });
        };

        if (page !== 1) {
            fetchData();
        }
    }, [page]);

    useEffect(() => {
        const fetchData = async () => {
            setEventsResult({
                ...eventsResult,
                isLoading: true,
            });
            const result = await getAllEvents.execute({
                title: searchTitle,
                page: 1,
                types: typeFilter,
                languageCodes: languageFilter.map((language) => language.code),
            });
            if (result instanceof Error) {
                return setEventsResult({
                    ...eventsResult,
                    events: [],
                    error: result,
                    isLoading: false,
                });
            }

            if (result.length < DEFAULT_NEWS_PAGE_SIZE) {
                setIsEventsListEnded(true);
            } else {
                setIsEventsListEnded(false);
            }
            setPage(1);
            setEventsResult({
                ...eventsResult,
                events: result,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [searchTitle, languageFilter, typeFilter]);

    return { ...eventsResult, searchTitle, setSearchTitle, isEventsListEnded, onLoadMoreEvents };
};

export default useGetEventsList;
