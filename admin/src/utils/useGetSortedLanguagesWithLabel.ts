import { useMemo } from 'react';
import { useTranslate } from 'react-admin';
import Language, { LanguageWithLabel } from '../entities/Language';

const useGetSortedLanguagesWithLabel = (languages: Language[] | undefined): LanguageWithLabel[] => {
    const translate = useTranslate();

    const sortedLanguages = useMemo(() => {
        if (!languages) return [];

        return languages
            .map((language: Language) => ({
                ...language,
                label: translate(`languages_code.${language.code}`),
            }))
            .sort((a: LanguageWithLabel, b: LanguageWithLabel) => a.label.localeCompare(b.label));
    }, [languages]);

    return sortedLanguages;
};

export default useGetSortedLanguagesWithLabel;
