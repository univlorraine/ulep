import { IonButton } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EventObject, { EventType } from '../../../../domain/entities/Event';
import Language from '../../../../domain/entities/Language';
import Profile from '../../../../domain/entities/Profile';
import useGetEventsList from '../../../hooks/useGetEventsList';
import EventLine from '../../events/EventLine';
import HeaderSubContent from '../../HeaderSubContent';
import FilterModal, { FiltersToDisplay } from '../../modals/FilterModal';
import SearchAndFilter, { Filter, FilterType } from '../../SearchAndFilter';
import styles from './EventsListContent.module.css';
interface EventsListContentProps {
    profile: Profile;
    onBackPressed: () => void;
    onEventPressed: (event?: EventObject) => void;
}

export const EventsListContent: React.FC<EventsListContentProps> = ({ profile, onBackPressed, onEventPressed }) => {
    const { t } = useTranslation();
    const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
    const [languageFilter, setLanguageFilter] = useState<Language[]>([]);
    const [eventTypeFilter, setEventTypeFilter] = useState<EventType[]>([]);
    const { events, searchTitle, setSearchTitle, isEventsListEnded, onLoadMoreEvents } = useGetEventsList(
        languageFilter,
        eventTypeFilter
    );

    const contentRef = useRef<HTMLDivElement>(null);

    const onFilterRemove = (filter: Filter) => {
        setLanguageFilter(languageFilter.filter((lang) => lang.code !== filter.id));
    };

    const onFilterClear = () => {
        setLanguageFilter([]);
    };

    const handleEventPressed = (event?: EventObject) => {
        onEventPressed(event);
    };

    const onFilterApplied = (filters: { languages?: Language[]; eventType?: EventType[] }) => {
        setLanguageFilter(filters.languages ?? []);
        setEventTypeFilter(filters.eventType ?? []);
        setShowFiltersModal(false);
    };

    return (
        <div className="subcontent-container content-wrapper" style={{ paddingTop: 0 }} ref={contentRef}>
            <HeaderSubContent title={t('events.list.title')} onBackPressed={onBackPressed} />
            <SearchAndFilter
                allFilters={languageFilter.map((lang) => ({
                    id: lang.code,
                    name: t(`languages_code.${lang.code}`),
                    type: FilterType.LANGUAGE,
                }))}
                onFilterRemove={onFilterRemove}
                onFilterClear={onFilterClear}
                searchTitle={searchTitle}
                setSearchTitle={setSearchTitle}
                setShowFiltersModal={setShowFiltersModal}
            />
            <div className={styles.list}>
                {events.length > 0 &&
                    events.map((event) => (
                        <EventLine
                            key={event.id}
                            event={event}
                            onClick={() => handleEventPressed(event)}
                            profile={profile}
                        />
                    ))}
            </div>
            {!isEventsListEnded && (
                <IonButton fill="clear" className="secondary-button" onClick={onLoadMoreEvents}>
                    {t('events.load_more')}
                </IonButton>
            )}
            <FilterModal
                filterToDisplay={[FiltersToDisplay.LANGUAGES, FiltersToDisplay.EVENT_TYPE]}
                isVisible={showFiltersModal}
                onClose={() => setShowFiltersModal(false)}
                onFilterApplied={onFilterApplied}
                profile={profile}
                currentLanguagesFilter={languageFilter}
                currentEventTypeFilter={eventTypeFilter}
                title="news.list.filter_title"
            />
        </div>
    );
};

export default EventsListContent;
