import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import Vocabulary from '../../domain/entities/Vocabulary';
import { useStoreState } from '../../store/storeTypes';

const useGetVocabularyFromListsId = (vocabularyListsId: string[], refresh: boolean) => {
    const { getVocabulariesFromListsIdUsecase } = useConfig();
    const profile = useStoreState((state) => state.profile);    

    const [vocabularyResult, setVocabularyResult] = useState<{
        vocabularies: Vocabulary[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        vocabularies: [],
        error: undefined,
        isLoading: true,
    });

    if (!profile) return vocabularyResult;

    useEffect(() => {
        const fetchData = async () => {
            setVocabularyResult({
                ...vocabularyResult,
                isLoading: true,
            });
            const result = await getVocabulariesFromListsIdUsecase.execute(vocabularyListsId);
            if (result instanceof Error) {
                return setVocabularyResult({ vocabularies: [], error: result, isLoading: false });
            }

            setVocabularyResult({
                vocabularies: result,
                error: undefined,
                isLoading: false,
            });            
        };

        fetchData();
    }, [profile, vocabularyListsId, refresh]);

    return vocabularyResult;
};

export default useGetVocabularyFromListsId;
