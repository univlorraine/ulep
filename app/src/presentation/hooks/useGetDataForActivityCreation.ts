import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { ActivityTheme } from '../../domain/entities/Activity';
import Language from '../../domain/entities/Language';
import Profile from '../../domain/entities/Profile';
import { DropDownItem } from '../components/DropDown';
import { codeLanguageToFlag } from '../utils';

export const CEFR_VALUES: CEFR[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const useGetDataForActivityCreation = (profile: Profile, refresh?: boolean) => {
    const { getActivityThemes } = useConfig();

    const [dataForActivityCreation, setDataForActivityCreation] = useState<{
        activityThemesDropDown: DropDownItem<ActivityTheme>[];
        cefrLevelsDropDown: DropDownItem<CEFR>[];
        languagesDropDown: DropDownItem<Language>[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        activityThemesDropDown: [],
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
            const activityThemesResult = await getActivityThemes.execute();
            if (activityThemesResult instanceof Error) {
                return setDataForActivityCreation({
                    ...dataForActivityCreation,
                    error: activityThemesResult,
                    isLoading: false,
                });
            }

            const activityThemesDropDown = activityThemesResult
                .map((activityTheme) => {
                    return activityTheme.themes.map((theme) => ({
                        label: theme.content,
                        value: theme,
                    }));
                })
                .flat() as DropDownItem<ActivityTheme>[];

            const cefrLevelsDropDown = CEFR_VALUES.map((cefr) => ({
                label: cefr,
                value: cefr,
            }));

            const languagesDropDown = [
                ...profile.learningLanguages,
                ...profile.masteredLanguages,
                profile.nativeLanguage,
            ].map((language) => ({
                label: `${codeLanguageToFlag(language.code)} ${language.name}`,
                value: language,
            }));

            return setDataForActivityCreation({
                ...dataForActivityCreation,
                activityThemesDropDown,
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
