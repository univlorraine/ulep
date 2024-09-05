import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import VocabularyList from '../../domain/entities/VocabularyList';
import { useStoreState } from '../../store/storeTypes';

const useGetVocabularyList = (refresh: boolean) => {
    const { getVocabularyLists } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [vocabularyListResult, setVocabularyListResult] = useState<{
        vocabularyLists: VocabularyList[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        vocabularyLists: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return vocabularyListResult;

    useEffect(() => {
        const fetchData = async () => {
            setVocabularyListResult({
                ...vocabularyListResult,
                isLoading: true,
            });
            const vocabularyListsResult = await getVocabularyLists.execute(profile.id);
            if (vocabularyListsResult instanceof Error) {
                return setVocabularyListResult({ vocabularyLists: [], error: vocabularyListsResult, isLoading: false });
            }

            setVocabularyListResult({
                vocabularyLists: vocabularyListsResult,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [profile, refresh]);

    return vocabularyListResult;
};

export default useGetVocabularyList;
