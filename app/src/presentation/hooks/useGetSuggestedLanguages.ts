import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import University from '../../domain/entities/University';
import Language from '../../domain/entities/Language';

const useGetSuggestedLanguages = (keepLearningLanguages?: boolean, deps?: any[]) => {
    const [languagesResult, setLanguagesResult] = useState<{
        languages: Language[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        languages: [],
        error: undefined,
        isLoading: false,
    });
    const { getAllLanguages } = useConfig();
    const profile = useStoreState((state) => state.profile);

    if (!profile) return languagesResult;

    useEffect(() => {
        const getLanguages = async () => {
            setLanguagesResult({
                ...languagesResult,
                isLoading: true,
            });
            const suggestedLanguagesResult = await getAllLanguages.execute('SECONDARY');

            if (suggestedLanguagesResult instanceof Error) {
                return setLanguagesResult({
                    ...languagesResult,
                    error: suggestedLanguagesResult,
                    isLoading: false,
                });
            }

            const learnableLanguages = suggestedLanguagesResult.filter(
                (language) =>
                    profile?.nativeLanguage.code !== language.code &&
                    !profile?.masteredLanguages?.find((otherLanguage) => language.code === otherLanguage.code) &&
                    (keepLearningLanguages ||
                        !profile?.learningLanguages?.find(
                            (learningLanguage) => language.code === learningLanguage.code
                        ))
            );

            return setLanguagesResult({
                ...languagesResult,
                languages: learnableLanguages,
                isLoading: false,
            });
        };

        getLanguages();
    }, deps);

    return languagesResult;
};

export default useGetSuggestedLanguages;
