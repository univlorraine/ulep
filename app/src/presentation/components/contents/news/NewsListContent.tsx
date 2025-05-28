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

import { IonButton } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Language from '../../../../domain/entities/Language';
import News from '../../../../domain/entities/News';
import Profile from '../../../../domain/entities/Profile';
import { useStoreActions, useStoreState } from '../../../../store/storeTypes';
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
    const { setNewsFilter } = useStoreActions((state) => state);
    const { newsFilter } = useStoreState((state) => state);

    const { news, searchTitle, setSearchTitle, isNewsListEnded, onLoadMoreNews } = useGetNewsList(newsFilter.language);
    const contentRef = useRef<HTMLDivElement>(null);

    const onFilterRemove = (filter: Filter) => {
        setNewsFilter({ language: newsFilter.language.filter((lang) => lang.code !== filter.id) });
    };

    const onFilterClear = () => {
        setNewsFilter({ language: [] });
    };

    const handleNewsPressed = (news: News) => {
        onNewsPressed(news);
    };

    const onFilterApplied = (filters: { languages?: Language[] }) => {
        setNewsFilter({ language: filters.languages ?? [] });
        setShowFiltersModal(false);
    };

    return (
        <div ref={contentRef}>
            <HeaderSubContent title={t('news.list.title')} onBackPressed={onBackPressed} />
            <SearchAndFilter
                allFilters={newsFilter.language?.map((lang) => ({
                    id: lang.code,
                    name: t(`languages_code.${lang.code}`),
                    type: FilterType.LANGUAGE,
                }))}
                onFilterRemove={onFilterRemove}
                onFilterClear={onFilterClear}
                searchTitle={searchTitle}
                setSearchTitle={setSearchTitle}
                setShowFiltersModal={setShowFiltersModal}
                searchI18nKey="news"
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
                {news.length === 0 && <span className={styles.noNews}>{t('home_page.news.no_news')}</span>}
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
                currentLanguagesFilter={newsFilter.language}
                title="news.list.filter_title"
            />
        </div>
    );
};

export default NewsListContent;
