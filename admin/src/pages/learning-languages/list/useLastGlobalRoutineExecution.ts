import { useState } from 'react';
import { useDataProvider } from 'react-admin';
import { useQuery } from 'react-query';
import { RoutineExecution, RoutineExecutionStatus } from '../../../entities/RoutineExecution';

const DEFAULT_POLLING_DELAY = 5 * 1000;
const QUERY_KEY = ['GLOBAL_ROUTINE', 'LAST_EXECUTION'];

const useLastGlobalRoutineExecution = (pollingDelayInSec?: number) => {
    const dataProvider = useDataProvider();

    const [enablePolling, setEnablePolling] = useState<boolean>(true);

    const { data, isLoading, isError, refetch } = useQuery(
        QUERY_KEY,
        () => dataProvider.getLastGlobalRoutineExecution(),
        {
            enabled: enablePolling,
            refetchInterval: pollingDelayInSec ? pollingDelayInSec * 1000 : DEFAULT_POLLING_DELAY,
            onSuccess: (res: RoutineExecution) => {
                if (res.status === RoutineExecutionStatus.ON_GOING) {
                    setEnablePolling(true);
                } else {
                    setEnablePolling(false);
                }
            },
            onError: (err: unknown) => {
                console.error(err);
                setEnablePolling(false);
            },
        }
    );

    return { data, isLoading, isError, refetch };
};

export default useLastGlobalRoutineExecution;
