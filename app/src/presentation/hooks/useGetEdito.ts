import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import Edito from '../../domain/entities/Edito';

const useGetEdito = (universityId?: string) => {
    const { getEditoByUniversityId } = useConfig();

    const [editoResult, setEditoResult] = useState<{
        edito: Edito | undefined;
        error: Error | undefined;
        isLoading: boolean;
    }>({
        edito: undefined,
        error: undefined,
        isLoading: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!universityId) {
                setEditoResult({
                    ...editoResult,
                    edito: undefined,
                    error: undefined,
                    isLoading: false,
                });
                return;
            }

            setEditoResult({
                ...editoResult,
                isLoading: true,
            });
            const result = await getEditoByUniversityId.execute(universityId);
            if (result instanceof Error) {
                return setEditoResult({
                    ...editoResult,
                    edito: undefined,
                    error: result,
                    isLoading: false,
                });
            }

            setEditoResult({
                ...editoResult,
                edito: result,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [universityId]);

    return { ...editoResult };
};

export default useGetEdito;
