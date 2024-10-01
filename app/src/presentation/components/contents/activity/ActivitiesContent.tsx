import { IonButton, IonIcon, IonImg, IonSearchbar } from '@ionic/react';
import { arrowBackOutline, closeOutline, filterOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg } from '../../../../assets';
import { Activity, ActivityTheme, ActivityThemeCategory } from '../../../../domain/entities/Activity';
import Language from '../../../../domain/entities/Language';
import Profile from '../../../../domain/entities/Profile';
import useGetActivities from '../../../hooks/useGetActivities';
import ActivityCard from '../../card/ActivityCard';
import Loader from '../../Loader';
import ActivityFilterModal from '../../modals/ActivityFilterModal';
import styles from './ActivitiesContent.module.css';

interface ActivitiesContentProps {
    themes: ActivityThemeCategory[];
    onAddActivity: () => void;
    onBackPressed: () => void;
    onActivityClick: (activity: Activity) => void;
    profile: Profile;
}

enum FilterType {
    LANGUAGE = 'language',
    PROFICIENCY = 'proficiency',
    ACTIVITY_THEME = 'activity_theme',
    IS_ME = 'is_me',
}

type Filter = {
    id: string;
    name: string;
    type: FilterType;
};

export const ActivitiesContent: React.FC<ActivitiesContentProps> = ({
    onBackPressed,
    onAddActivity,
    onActivityClick,
    profile,
    themes,
}) => {
    const { t } = useTranslation();
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [languageFilter, setLanguageFilter] = useState<Language[]>([]);
    const [proficiencyFilter, setProficiencyFilter] = useState<CEFR[]>([]);
    const [activityThemeFilter, setActivityThemeFilter] = useState<ActivityTheme[]>([]);
    const [isMeFilter, setIsMeFilter] = useState<boolean>(false);
    const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);

    const contentRef = useRef<HTMLDivElement>(null);

    const { activities, isLoading, handleOnEndReached } = useGetActivities({
        language: languageFilter,
        proficiency: proficiencyFilter,
        activityTheme: activityThemeFilter,
        isMe: isMeFilter,
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
        languages: Language[];
        levels: CEFR[];
        themes: ActivityTheme[];
        isMine: boolean;
    }) => {
        setLanguageFilter(filters.languages);
        setProficiencyFilter(filters.levels);
        setActivityThemeFilter(filters.themes);
        setIsMeFilter(filters.isMine);
        setShowFiltersModal(false);
    };

    const allFiltersName = () => {
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

        if (isMeFilter) {
            filters.push({ id: 'is_me', name: t('activity.list.filter.is_mine'), type: FilterType.IS_ME });
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
            case FilterType.IS_ME:
                setIsMeFilter(false);
                break;
        }
    };

    const onFilterClear = () => {
        setLanguageFilter([]);
        setProficiencyFilter([]);
        setActivityThemeFilter([]);
        setIsMeFilter(false);
    };

    const allFilters = allFiltersName();
    return (
        <div className="subcontent-container content-wrapper" ref={contentRef}>
            <div className="subcontent-header">
                <IonButton fill="clear" onClick={onBackPressed}>
                    <IonIcon icon={arrowBackOutline} color="dark" />
                </IonButton>
                <p className="subcontent-title">{t('activity.list.title')}</p>
                <div />
            </div>

            <div className="activity-list">
                <IonSearchbar
                    placeholder={t('activity.list.search') as string}
                    value={searchTitle}
                    onIonChange={(e) => setSearchTitle(e.detail.value as string)}
                />
                <div className={styles['filter-container']}>
                    <div>
                        <IonButton
                            className={styles['filter-button']}
                            fill="clear"
                            onClick={() => setShowFiltersModal(true)}
                        >
                            <IonIcon icon={filterOutline} className={styles['filter-icon']} aria-hidden />
                            {t('activity.list.filter_title')}
                        </IonButton>
                    </div>
                    <div>
                        {allFilters.map((filter) => (
                            <IonButton
                                fill="clear"
                                key={filter.id}
                                className={styles['active-filter-button']}
                                aria-label={t('activity.list.filter_remove', { filter }) as string}
                                onClick={() => onFilterRemove(filter)}
                            >
                                {filter.name}
                                <IonIcon icon={closeOutline} aria-hidden />
                            </IonButton>
                        ))}
                        {allFilters.length > 0 && (
                            <IonButton className={styles['filter-button']} fill="clear" onClick={() => onFilterClear()}>
                                {t('activity.list.filter_clear')}
                            </IonButton>
                        )}
                    </div>
                    <div className={styles['activity-list-container']}>
                        {activities.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity} onClick={onActivityClick} />
                        ))}
                    </div>
                    {isLoading && <Loader />}
                </div>
            </div>

            <IonButton fill="clear" className="add-button" onClick={() => onAddActivity()}>
                <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
            </IonButton>
            <ActivityFilterModal
                isVisible={showFiltersModal}
                onClose={() => setShowFiltersModal(false)}
                onFilterApplied={onFilterApplied}
                profile={profile}
                themes={themes}
                currentIsMineFilter={isMeFilter}
                currentLanguagesFilter={languageFilter}
                currentLevelsFilter={proficiencyFilter}
                currentThemesFilter={activityThemeFilter}
            />
        </div>
    );
};

export default ActivitiesContent;
