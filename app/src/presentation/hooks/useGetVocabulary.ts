import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import Vocabulary from '../../domain/entities/Vocabulary';
import VocabularyList from '../../domain/entities/VocabularyList';
import { useStoreState } from '../../store/storeTypes';

const useGetVocabulary = (vocabularyList: VocabularyList, search: string, refresh: boolean) => {
    const { getVocabularies } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [vocabularyResult, setVocabularyResult] = useState<{
        vocabulary: Vocabulary[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        vocabulary: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return vocabularyResult;

    useEffect(() => {
        const fetchData = async () => {
            setVocabularyResult({
                ...vocabularyResult,
                isLoading: true,
            });
            const result = await getVocabularies.execute(vocabularyList.id, search);
            if (result instanceof Error) {
                return setVocabularyResult({ vocabulary: [], error: result, isLoading: false });
            }

            setVocabularyResult({
                vocabulary: result,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [profile, vocabularyList, refresh, search]);

    return vocabularyResult;
};

export default useGetVocabulary;
