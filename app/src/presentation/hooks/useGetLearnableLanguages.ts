import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import University from '../../domain/entities/University';
import Language from '../../domain/entities/Language';

const useGetLearnableLanguages = (university: University, keepLearningLanguages?: boolean, deps?: any[]) => {
    const [languagesResult, setLanguagesResult] = useState<{
        languages: Language[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        languages: [],
        error: undefined,
        isLoading: false,
    });
    const { getAllLanguages, getUniversityLanguages } = useConfig();
    const profile = useStoreState((state) => state.profile);

    if (!profile) return languagesResult;

    useEffect(() => {
        const getLanguages = async () => {
            setLanguagesResult({
                ...languagesResult,
                isLoading: true,
            });
            let [globalLanguages, universityLanguages] = await Promise.all([
                getAllLanguages.execute(university.isCentral ? 'PRIMARY' : 'PARTNER'),
                getUniversityLanguages.execute(university.id),
            ]);

            if (globalLanguages instanceof Error) {
                return setLanguagesResult({
                    ...languagesResult,
                    error: globalLanguages,
                    isLoading: false,
                });
            }

            if (universityLanguages instanceof Error) {
                return setLanguagesResult({
                    ...languagesResult,
                    error: universityLanguages,
                    isLoading: false,
                });
            }

            const learnableLanguages = [...globalLanguages, ...universityLanguages].filter(
                (language) =>
                    profile?.nativeLanguage.code !== language.code &&
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

export default useGetLearnableLanguages;
