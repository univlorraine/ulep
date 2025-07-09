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
        <div className="content-wrapper" style={{ paddingTop: 0 }} ref={contentRef}>
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
                searchI18nKey="events"
            />
            <div className={styles.list} role="list">
                {events.length > 0 &&
                    events.map((event) => (
                        <EventLine
                            key={event.id}
                            event={event}
                            onClick={() => handleEventPressed(event)}
                            profile={profile}
                        />
                    ))}
                {events.length === 0 && (
                    <div className={styles.no_events}>
                        <p>{t('events.no_events')}</p>
                    </div>
                )}
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
