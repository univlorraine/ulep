import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import EventObject from '../../domain/entities/Event';
import { useStoreState } from '../../store/storeTypes';

const useGetEvent = (eventId: string, refresh: boolean) => {
    const { getEvent } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [eventResult, setEventResult] = useState<{
        event: EventObject | undefined;
        error: Error | undefined;
        isLoading: boolean;
    }>({
        event: undefined,
        error: undefined,
        isLoading: false,
    });

    if (!profile)
        return {
            ...eventResult,
            error: undefined,
            isLoading: false,
        };

    useEffect(() => {
        const fetchData = async () => {
            setEventResult({
                ...eventResult,
                isLoading: true,
            });
            const result = await getEvent.execute(eventId);
            if (result instanceof Error) {
                return setEventResult({
                    ...eventResult,
                    event: undefined,
                    error: result,
                    isLoading: false,
                });
            }

            setEventResult({
                ...eventResult,
                event: result,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [eventId, refresh]);

    return { ...eventResult };
};

export default useGetEvent;
