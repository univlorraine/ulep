import { IonButton, IonImg } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg } from '../../../../assets';
import { Activity, ActivityTheme, ActivityThemeCategory } from '../../../../domain/entities/Activity';
import Language from '../../../../domain/entities/Language';
import Profile from '../../../../domain/entities/Profile';
import useGetActivities from '../../../hooks/useGetActivities';
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
}

export const ActivitiesContent: React.FC<ActivitiesContentProps> = ({
    onBackPressed,
    onAddActivity,
    onActivityClick,
    profile,
    themes,
    isModal,
}) => {
    const { t } = useTranslation();
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [languageFilter, setLanguageFilter] = useState<Language[]>([]);
    const [proficiencyFilter, setProficiencyFilter] = useState<CEFR[]>([]);
    const [activityThemeFilter, setActivityThemeFilter] = useState<ActivityTheme[]>([]);
    const [shouldTakeAllMineFilter, setShouldTakeAllMineFilter] = useState<boolean>(false);
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
                        <ActivityCard key={activity.id} activity={activity} onClick={onActivityClick} />
                    ))}
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
