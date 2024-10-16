import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Language from '../../../../domain/entities/Language';
import News from '../../../../domain/entities/News';
import Profile from '../../../../domain/entities/Profile';
import HeaderSubContent from '../../HeaderSubContent';
import SearchAndFilter, { Filter, FilterType } from '../../SearchAndFilter';

interface NewListContentProps {
    news: News[];
    profile: Profile;
    searchTitle: string;
    setSearchTitle: (title: string) => void;
    onBackPressed: () => void;
}

export const NewsListContent: React.FC<NewListContentProps> = ({
    news,
    profile,
    onBackPressed,
    setSearchTitle,
    searchTitle,
}) => {
    const { t } = useTranslation();
    const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
    const [languageFilter, setLanguageFilter] = useState<Language[]>([]);

    const contentRef = useRef<HTMLDivElement>(null);

    const onFilterRemove = (filter: Filter) => {
        setLanguageFilter(languageFilter.filter((lang) => lang.code !== filter.id));
    };

    const onFilterClear = () => {
        setLanguageFilter([]);
    };

    const setAllFilters = () => {
        const filters: Filter[] = [];
        const languageFilter = [profile.nativeLanguage, ...profile.masteredLanguages, ...profile.learningLanguages];
        if (languageFilter.length > 0) {
            languageFilter.forEach((lang) => {
                filters.push({ id: lang.code, name: t(`languages_code.${lang.code}`), type: FilterType.LANGUAGE });
            });
        }

        return filters;
    };

    const allFilters: Filter[] = setAllFilters();

    return (
        <div className="subcontent-container content-wrapper" style={{ paddingTop: 0 }} ref={contentRef}>
            <HeaderSubContent title={t('news.list.title')} onBackPressed={onBackPressed} />
            <SearchAndFilter
                allFilters={allFilters}
                searchTitle={searchTitle}
                setSearchTitle={setSearchTitle}
                setShowFiltersModal={setShowFiltersModal}
                onFilterRemove={onFilterRemove}
                onFilterClear={onFilterClear}
            />
        </div>
    );
};

export default NewsListContent;
