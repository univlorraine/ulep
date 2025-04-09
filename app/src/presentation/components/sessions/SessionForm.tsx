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

import { IonButton, IonDatetime, IonDatetimeButton, IonModal, useIonToast } from '@ionic/react';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import Profile from '../../../domain/entities/Profile';
import Session from '../../../domain/entities/Session';
import { useStoreState } from '../../../store/storeTypes';
import { SessionFormData } from '../contents/SessionFormContent';
import TextInput from '../TextInput';
import styles from './SessionForm.module.css';

interface SessionFormProps {
    onBackPressed: (() => void) | undefined;
    onSubmit: (data: SessionFormData) => void;
    session?: Session;
    partner?: Profile;
    profile?: Profile;
}

const SessionForm: React.FC<SessionFormProps> = ({ onBackPressed, onSubmit, session, profile, partner }) => {
    const userTz = profile?.user?.university?.timezone; // TODO: replace university timezone by user profile timezone
    const partnerTz = partner?.user?.university?.timezone; // TODO: replace university timezone by partner profile timezone
    const language = useStoreState((state) => state.language) || 'en-US'; // Default to 'en-US' if language is not set

    if (!userTz || !partnerTz) {
        return <Redirect to="/" />;
    }

    const startAt = session?.startAt || new Date();
    const { t } = useTranslation();
    const [useToast] = useIonToast();
    const [datetime, setDatetime] = useState<string>(formatInTimeZone(startAt, userTz, "yyyy-MM-dd'T'HH:mm"));
    const [comment, setComment] = useState(session?.comment || '');

    const formatTime = useMemo(() => {
        return (date: Date, timeZone: string) => {
            return new Intl.DateTimeFormat(language, {
                hour: 'numeric',
                minute: 'numeric',
                hour12: language.startsWith('en'),
                timeZone,
            }).format(date);
        };
    }, [language]);

    const handleSubmit = () => {
        const selectedDate = new Date(datetime);
        if (selectedDate.getTime() < new Date().getTime()) {
            return useToast({
                message: t('session.error.past_date'),
                duration: 3000,
                position: 'bottom',
            });
        }
        onSubmit({ id: session?.id, date: fromZonedTime(datetime, userTz), comment });
    };

    const onDatetimeChange = (newDate: string) => {
        setDatetime(newDate);
    };

    const isDateToCome = (dateString: string) => {
        const selectedDate = new Date(dateString);
        const now = new Date();
        return selectedDate.setHours(0, 0, 0, 0) >= now.setHours(0, 0, 0, 0);
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.datetime}>
                    <p className={styles.label}>{t('session.date_and_hour')}</p>
                    <IonDatetimeButton className={styles.datetimeBtn} datetime="datetime"></IonDatetimeButton>
                    {userTz !== partnerTz && (
                        <p className={styles.datetimeInfo}>
                            {t('session.time_for_partner', { name: partner?.user?.firstname })}
                            <strong> {formatTime(fromZonedTime(datetime, userTz), partnerTz)} </strong>(
                            {formatInTimeZone(fromZonedTime(datetime, userTz), partnerTz, 'zzzz, zzz')})
                        </p>
                    )}
                    <IonModal keepContentsMounted={true}>
                        <IonDatetime
                            id="datetime"
                            value={datetime}
                            onIonChange={(e) => onDatetimeChange(e.detail.value as string)}
                            isDateEnabled={isDateToCome}
                            locale={language}
                        ></IonDatetime>
                    </IonModal>
                </div>
                <div className={styles.language}>
                    <p className={styles.label}>{t('session.comment')}</p>
                    <TextInput
                        id="input-comment"
                        type="text-area"
                        onChange={setComment}
                        value={comment}
                        showLimit
                        maxLength={250}
                    />
                </div>
            </div>
            <div className={styles['button-container']}>
                <IonButton fill="clear" className="tertiary-button no-padding" onClick={onBackPressed}>
                    {t('activity.create.cancel_button')}
                </IonButton>
                <IonButton fill="clear" className={`primary-button no-padding`} onClick={handleSubmit}>
                    {session?.id ? t('session.form.update') : t('session.form.submit')}
                </IonButton>
            </div>
        </>
    );
};

export default SessionForm;
