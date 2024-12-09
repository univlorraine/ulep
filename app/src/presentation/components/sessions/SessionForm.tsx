import { IonButton, IonDatetime, IonDatetimeButton, IonModal } from '@ionic/react';
import { addDays, setHours, setMinutes, startOfTomorrow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import Profile from '../../../domain/entities/Profile';
import Session from '../../../domain/entities/Session';
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
    const userTz = profile?.user?.university?.timezone;
    const partnerTz = partner?.user?.university?.timezone;

    if (!userTz || !partnerTz) {
        return <Redirect to="/" />;
    }

    const startAt = session?.startAt || setMinutes(setHours(addDays(new Date(), 1), 18), 0);
    const { t } = useTranslation();
    const [datetime, setDatetime] = useState<string>(formatInTimeZone(startAt, userTz, "yyyy-MM-dd'T'HH:mm"));
    const [comment, setComment] = useState(session?.comment || '');

    const handleSubmit = () => {
        onSubmit({ id: session?.id, date: new Date(datetime), comment });
    };

    const onDatetimeChange = (newDate: string) => {
        setDatetime(newDate);
    };

    const isDateToCome = (dateString: string) => new Date(dateString).getTime() >= startOfTomorrow().getTime();

    return (
        <>
            <div className={styles.container}>
                <div className={styles.datetime}>
                    <p className={styles.label}>{t('session.date_and_hour')}</p>
                    <IonDatetimeButton className={styles.datetimeBtn} datetime="datetime"></IonDatetimeButton>
                    {userTz !== partnerTz && (
                        <p className={styles.datetimeInfo}>
                            {t('session.time_for_partner', { name: partner?.user?.firstname })}
                            <strong> {formatInTimeZone(new Date(datetime), partnerTz, 'HH:mm')} </strong>(
                            {formatInTimeZone(new Date(datetime), partnerTz, 'zzzz, zzz')})
                        </p>
                    )}
                    <IonModal keepContentsMounted={true}>
                        <IonDatetime
                            id="datetime"
                            value={datetime}
                            onIonChange={(e) => onDatetimeChange(e.detail.value as string)}
                            isDateEnabled={isDateToCome}
                        ></IonDatetime>
                    </IonModal>
                </div>
                <div className={styles.language}>
                    <p className={styles.label}>{t('session.comment')}</p>
                    <TextInput type="text-area" onChange={setComment} value={comment} />
                </div>
            </div>
            <div className={`${styles['button-container']} large-margin-top`}>
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
