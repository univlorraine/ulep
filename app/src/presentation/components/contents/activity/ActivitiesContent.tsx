/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { IonButton, IonImg } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg } from '../../../../assets';
import { Activity, ActivityTheme, ActivityThemeCategory } from '../../../../domain/entities/Activity';
import Language from '../../../../domain/entities/Language';
import Profile from '../../../../domain/entities/Profile';
import useGetActivities from '../../../hooks/useGetActivities';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../../utils';
import ActivityCard from '../../card/ActivityCard';
import HeaderSubContent from '../../HeaderSubContent';
import Loader from '../../Loader';
import FilterModal, { FiltersToDisplay } from '../../modals/FilterModal';
import SearchAndFilter, { Filter, FilterType } from '../../SearchAndFilter';
import styles from './ActivitiesContent.module.css';

interface ActivitiesContentProps {
    themes: ActivityThemeCategory[];
    onAddActivity: () => void;
    onBackPressed: () => void;
    onActivityClick: (activity: Activity) => void;
    profile: Profile;
    isModal?: boolean;
    languageFilter: Language[];
    setLanguageFilter: (languageFilter: Language[]) => void;
    proficiencyFilter: CEFR[];
    setProficiencyFilter: (proficiencyFilter: CEFR[]) => void;
    activityThemeFilter: ActivityTheme[];
    setActivityThemeFilter: (activityThemeFilter: ActivityTheme[]) => void;
    shouldTakeAllMineFilter: boolean;
    setShouldTakeAllMineFilter: (shouldTakeAllMineFilter: boolean) => void;
}

export const ActivitiesContent: React.FC<ActivitiesContentProps> = ({
    onBackPressed,
    onAddActivity,
    onActivityClick,
    profile,
    themes,
    isModal,
    languageFilter,
    setLanguageFilter,
    proficiencyFilter,
    setProficiencyFilter,
    activityThemeFilter,
    setActivityThemeFilter,
    shouldTakeAllMineFilter,
    setShouldTakeAllMineFilter,
}) => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);

    const contentRef = useRef<HTMLDivElement>(null);

    const { activities, isLoading, handleOnEndReached } = useGetActivities({
        language: languageFilter,
        proficiency: proficiencyFilter,
        activityTheme: activityThemeFilter,
        shouldTakeAllMine: shouldTakeAllMineFilter,
        searchTitle: searchTitle,
    });

    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
                if (scrollTop + clientHeight >= scrollHeight) {
                    handleOnEndReached();
                }
            }
        };

        const currentRef = contentRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleOnEndReached]);

    const onFilterApplied = (filters: {
        languages?: Language[];
        levels?: CEFR[];
        themes?: ActivityTheme[];
        shouldTakeAllMine?: boolean;
    }) => {
        setLanguageFilter(filters.languages ?? []);
        setProficiencyFilter(filters.levels ?? []);
        setActivityThemeFilter(filters.themes ?? []);
        setShouldTakeAllMineFilter(filters.shouldTakeAllMine ?? false);
        setShowFiltersModal(false);
    };

    const setAllFilters = () => {
        const filters: Filter[] = [];
        if (languageFilter.length > 0) {
            languageFilter.forEach((lang) => {
                filters.push({ id: lang.code, name: t(`languages_code.${lang.code}`), type: FilterType.LANGUAGE });
            });
        }
        if (proficiencyFilter.length > 0) {
            proficiencyFilter.forEach((proficiency) => {
                filters.push({ id: proficiency, name: proficiency, type: FilterType.PROFICIENCY });
            });
        }

        if (activityThemeFilter.length > 0) {
            activityThemeFilter.forEach((acitivity) => {
                filters.push({ id: acitivity.id, name: acitivity.content, type: FilterType.ACTIVITY_THEME });
            });
        }

        if (shouldTakeAllMineFilter) {
            filters.push({
                id: 'is_me',
                name: t('activity.list.filter.is_mine'),
                type: FilterType.SHOULD_TAKE_ALL_MINE,
            });
        }

        return filters;
    };

    const onFilterRemove = (filter: Filter) => {
        switch (filter.type) {
            case FilterType.LANGUAGE:
                setLanguageFilter(languageFilter.filter((lang) => lang.code !== filter.id));
                break;
            case FilterType.PROFICIENCY:
                setProficiencyFilter(proficiencyFilter.filter((proficiency) => proficiency !== filter.id));
                break;
            case FilterType.ACTIVITY_THEME:
                setActivityThemeFilter(activityThemeFilter.filter((activity) => activity.id !== filter.id));
                break;
            case FilterType.SHOULD_TAKE_ALL_MINE:
                setShouldTakeAllMineFilter(false);
                break;
        }
    };

    const onFilterClear = () => {
        setLanguageFilter([]);
        setProficiencyFilter([]);
        setActivityThemeFilter([]);
        setShouldTakeAllMineFilter(false);
    };

    const allFilters = setAllFilters();
    return (
        <div style={{ paddingTop: 0 }} ref={contentRef}>
            <HeaderSubContent title={t('activity.list.title')} onBackPressed={onBackPressed} isBackButton={isModal} />
            <div className={styles['activity-list']}>
                <SearchAndFilter
                    allFilters={allFilters}
                    searchTitle={searchTitle}
                    setSearchTitle={setSearchTitle}
                    setShowFiltersModal={setShowFiltersModal}
                    onFilterRemove={onFilterRemove}
                    onFilterClear={onFilterClear}
                />
                <div className={styles['activity-list-container']}>
                    {activities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onClick={onActivityClick}
                            isHybrid={isHybrid}
                        />
                    ))}
                    <div />
                </div>
                {isLoading && <Loader />}
            </div>

            <IonButton fill="clear" className="add-button" onClick={() => onAddActivity()}>
                <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
            </IonButton>
            <FilterModal
                filterToDisplay={[
                    FiltersToDisplay.IS_MINE,
                    FiltersToDisplay.LANGUAGES,
                    FiltersToDisplay.LEVELS,
                    FiltersToDisplay.THEMES,
                ]}
                isVisible={showFiltersModal}
                onClose={() => setShowFiltersModal(false)}
                onFilterApplied={onFilterApplied}
                profile={profile}
                themes={themes}
                currentShouldTakeAllMineFilter={shouldTakeAllMineFilter}
                currentLanguagesFilter={languageFilter}
                currentLevelsFilter={proficiencyFilter}
                currentThemesFilter={activityThemeFilter}
                title="activity.list.filter_title"
            />
        </div>
    );
};

export default ActivitiesContent;
