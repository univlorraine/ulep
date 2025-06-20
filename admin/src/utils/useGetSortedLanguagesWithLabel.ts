import { useMemo } from 'react';
import Language, { LanguageWithLabel } from '../entities/Language';
import useGetTranslatedLanguageCode from './useGetTranslatedLanguageCode';

const useGetSortedLanguagesWithLabel = (languages: Language[] | undefined): LanguageWithLabel[] => {
    const translateLanguageCode = useGetTranslatedLanguageCode();

    const sortedLanguages = useMemo(() => {
        if (!languages) return [];

        return languages
            .map((language: Language) => ({
                ...language,
                label: translateLanguageCode(language.code),
            }))
            .sort((a: LanguageWithLabel, b: LanguageWithLabel) => a.label.localeCompare(b.label));
    }, [languages]);

    return sortedLanguages;
};

export default useGetSortedLanguagesWithLabel;
