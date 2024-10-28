import { IonButton, IonIcon, IonSearchbar } from '@ionic/react';
import { closeOutline, filterOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import styles from './SearchAndFilter.module.css';

export enum FilterType {
    LANGUAGE = 'language',
    PROFICIENCY = 'proficiency',
    ACTIVITY_THEME = 'activity_theme',
    SHOULD_TAKE_ALL_MINE = 'should_take_all_mine',
}

export type Filter = {
    id: string;
    name: string;
    type: FilterType;
};

interface SearchAndFilterProps {
    searchTitle: string;
    setSearchTitle: (title: string) => void;
    setShowFiltersModal: (show: boolean) => void;
    allFilters: Filter[];
    onFilterRemove: (filter: Filter) => void;
    onFilterClear: () => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    allFilters,
    searchTitle,
    setSearchTitle,
    setShowFiltersModal,
    onFilterRemove,
    onFilterClear,
}) => {
    const { t } = useTranslation();
    return (
        <div>
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
            </div>
        </div>
    );
};

export default SearchAndFilter;
