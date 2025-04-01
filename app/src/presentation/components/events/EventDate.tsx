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

import { IonIcon, useIonToast } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import EventObject from '../../../domain/entities/Event';
import Profile from '../../../domain/entities/Profile';
import { useStoreState } from '../../../store/storeTypes';
import styles from './EventDate.module.css';
interface EventDateProps {
    showAddToCalendar?: boolean;
    event: EventObject;
    profile: Profile;
}

const EventDate: React.FC<EventDateProps> = ({ event, profile, showAddToCalendar = false }) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { fileAdapter } = useConfig();
    const language = useStoreState((state) => state.language);

    const handleAddToCalendar = async (event: EventObject) => {
        const address = event.address || event.deepLink || ''; // Utilise une chaîne vide si l'adresse est nulle
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${event.id}
SUMMARY:${event.title}
DTSTAMP:${formatDateToICS(new Date())}
DTSTART:${formatDateToICS(new Date(event.startDate))}
DTEND:${formatDateToICS(new Date(event.endDate))}
LOCATION:${address}
END:VEVENT
END:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        await fileAdapter.saveBlob(blob, `${event.title.replace(/ /g, '_')}.ics`);
        await showToast({
            message: t('events.add_to_calendar_success'),
            duration: 3000,
        });
    };

    const formatDateToICS = (date: Date) => {
        const dateObject = new Date(date);
        return dateObject
            .toISOString()
            .replace(/[-:]/g, '')
            .replace(/\.\d+Z$/, 'Z');
    };

    const formattedDate = new Intl.DateTimeFormat(language || profile.nativeLanguage.code, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(event.startDate));
    return (
        <div className={styles['date-container']}>
            <IonIcon icon={calendarOutline} />
            <span className={styles.date}>{formattedDate}</span>
            {showAddToCalendar && (
                <button className={styles.calendarButton} onClick={() => handleAddToCalendar(event)}>
                    {t('events.add_to_calendar')}
                </button>
            )}
        </div>
    );
};

export default EventDate;
