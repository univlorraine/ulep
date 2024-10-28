import { IonButton } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Language from '../../../../domain/entities/Language';
import News from '../../../../domain/entities/News';
import Profile from '../../../../domain/entities/Profile';
import useGetNewsList from '../../../hooks/useGetNewsList';
import HeaderSubContent from '../../HeaderSubContent';
import FilterModal, { FiltersToDisplay } from '../../modals/FilterModal';
import NewsLine from '../../news/NewsLine';
import SearchAndFilter, { Filter, FilterType } from '../../SearchAndFilter';
import styles from './NewsListContent.module.css';
interface NewListContentProps {
    profile: Profile;
    onBackPressed: () => void;
    onNewsPressed: (news: News) => void;
}

export const NewsListContent: React.FC<NewListContentProps> = ({ profile, onBackPressed, onNewsPressed }) => {
    const { t } = useTranslation();
    const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
    const [languageFilter, setLanguageFilter] = useState<Language[]>([]);

    const { news, searchTitle, setSearchTitle, isNewsListEnded, onLoadMoreNews } = useGetNewsList(languageFilter);
    const contentRef = useRef<HTMLDivElement>(null);

    const onFilterRemove = (filter: Filter) => {
        setLanguageFilter(languageFilter.filter((lang) => lang.code !== filter.id));
    };

    const onFilterClear = () => {
        setLanguageFilter([]);
    };

    const handleNewsPressed = (news: News) => {
        onNewsPressed(news);
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
            <div className={styles.list}>
                {news.map((newsItem: News) => (
                    <NewsLine
                        key={newsItem.id}
                        news={newsItem}
                        profile={profile}
                        onClick={() => handleNewsPressed(newsItem)}
                    />
                ))}
                {!isNewsListEnded && (
                    <IonButton fill="clear" className="secondary-button" onClick={onLoadMoreNews}>
                        {t('news.list.load_more')}
                    </IonButton>
                )}
            </div>
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

export default NewsListContent;
