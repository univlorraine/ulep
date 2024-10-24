import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EventObject from '../../../../domain/entities/Event';
import Language from '../../../../domain/entities/Language';
import Profile from '../../../../domain/entities/Profile';
import HeaderSubContent from '../../HeaderSubContent';
import FilterModal, { FiltersToDisplay } from '../../modals/FilterModal';
import SearchAndFilter, { Filter, FilterType } from '../../SearchAndFilter';

interface EventsListContentProps {
    profile: Profile;
    onBackPressed: () => void;
    onEventPressed: (event: EventObject) => void;
}

export const EventsListContent: React.FC<EventsListContentProps> = ({ profile, onBackPressed, onEventPressed }) => {
    const { t } = useTranslation();
    const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
    const [languageFilter, setLanguageFilter] = useState<Language[]>([]);
    const [searchTitle, setSearchTitle] = useState<string>('');

    const contentRef = useRef<HTMLDivElement>(null);

    const onFilterRemove = (filter: Filter) => {
        setLanguageFilter(languageFilter.filter((lang) => lang.code !== filter.id));
    };

    const onFilterClear = () => {
        setLanguageFilter([]);
    };

    const handleEventPressed = (event: EventObject) => {
        onEventPressed(event);
    };

    const onFilterApplied = (filters: { languages?: Language[] }) => {
        setLanguageFilter(filters.languages ?? []);
        setShowFiltersModal(false);
    };

    return (
        <div className="subcontent-container content-wrapper" style={{ paddingTop: 0 }} ref={contentRef}>
            <HeaderSubContent title={t('news.list.title')} onBackPressed={onBackPressed} />
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
            <FilterModal
                filterToDisplay={[FiltersToDisplay.LANGUAGES]}
                isVisible={showFiltersModal}
                onClose={() => setShowFiltersModal(false)}
                onFilterApplied={onFilterApplied}
                profile={profile}
                currentLanguagesFilter={languageFilter}
                title="news.list.filter_title"
            />
        </div>
    );
};

export default EventsListContent;
