import { useEffect, useState } from 'react';
import { ActivityThemeCategory } from '../../domain/entities/Activity';
import Language from '../../domain/entities/Language';
import Profile from '../../domain/entities/Profile';
import { DropDownItem } from '../components/DropDown';
import { codeLanguageToFlag } from '../utils';

export const CEFR_VALUES: CEFR[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const useGetDataForActivityCreation = (themes: ActivityThemeCategory[], profile: Profile, refresh?: boolean) => {
    const [dataForActivityCreation, setDataForActivityCreation] = useState<{
        activityThemesCategoryDropDown: DropDownItem<ActivityThemeCategory>[];
        cefrLevelsDropDown: DropDownItem<CEFR>[];
        languagesDropDown: DropDownItem<Language>[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        activityThemesCategoryDropDown: [],
        cefrLevelsDropDown: [],
        languagesDropDown: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return dataForActivityCreation;

    useEffect(() => {
        const fetchData = async () => {
            setDataForActivityCreation({
                ...dataForActivityCreation,
                isLoading: true,
            });

            const activityThemesCategoryDropDown = themes.map((theme) => ({
                label: theme.content,
                value: theme,
            }));

            const cefrLevelsDropDown = CEFR_VALUES.map((cefr) => ({
                label: cefr,
                value: cefr,
            }));

            const languagesDropDown = [...profile.masteredLanguages, profile.nativeLanguage].map((language) => ({
                label: `${codeLanguageToFlag(language.code)} ${language.name}`,
                value: language,
            }));

            return setDataForActivityCreation({
                ...dataForActivityCreation,
                activityThemesCategoryDropDown,
                cefrLevelsDropDown,
                languagesDropDown,
                isLoading: false,
            });
        };

        fetchData();
    }, [profile, refresh]);

    return dataForActivityCreation;
};

export default useGetDataForActivityCreation;
