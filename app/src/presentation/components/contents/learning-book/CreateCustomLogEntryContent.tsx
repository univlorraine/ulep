import { IonButton, IonDatetime } from '@ionic/react';
import { isBefore, startOfDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Profile from '../../../../domain/entities/Profile';
import HeaderSubContent from '../../HeaderSubContent';
import TextInput from '../../TextInput';
import styles from './CreateCustomLogEntryContent.module.css';

interface CreateCustomLogEntryContentProps {
    onBackPressed: () => void;
    onSubmit: (data: { date: Date; title: string; description: string }) => void;
    profile: Profile;
}

export const CreateCustomLogEntryContent = ({ onSubmit, onBackPressed, profile }: CreateCustomLogEntryContentProps) => {
    const userTz = profile?.user?.university?.timezone;
    const { t } = useTranslation();
    const [entryDate, setEntryDate] = useState<string>(formatInTimeZone(new Date(), userTz, "yyyy-MM-dd'T'HH:mm"));
    const [entryTitle, setEntryTitle] = useState<string>('');
    const [entryDescription, setEntryDescription] = useState<string>('');

    const allRequiredFieldsAreFilled = () => {
        return entryDate && entryTitle && entryDescription;
    };

    const handleSubmit = () => {
        if (isBefore(entryDate, startOfDay(new Date()))) {
            return;
        }

        onSubmit({
            date: new Date(entryDate),
            title: entryTitle,
            description: entryDescription,
        });
    };

    return (
        <div>
            <HeaderSubContent title={t('learning_book.create.title')} onBackPressed={onBackPressed} isBackButton />
            <div className={styles.container}>
                <p className={styles.date_label}>{t('learning_book.create.date_label')}</p>
                <IonDatetime
                    id="datetime"
                    value={entryDate}
                    max={formatInTimeZone(new Date(), userTz, "yyyy-MM-dd'T'HH:mm")}
                    presentation="date"
                    onIonChange={(e) => setEntryDate(e.detail.value as string)}
                ></IonDatetime>

                <TextInput
                    title={t('learning_book.create.title_label') as string}
                    value={entryTitle}
                    onChange={(title: string) => setEntryTitle(title)}
                />

                <TextInput
                    title={t('learning_book.create.description_label') as string}
                    value={entryDescription}
                    onChange={(description: string) => setEntryDescription(description)}
                    type="text-area"
                />
                <div className={`${styles['button-container']} large-margin-top`}>
                    <IonButton fill="clear" className="tertiary-button no-padding" onClick={onBackPressed}>
                        {t('learning_book.create.cancel_button')}
                    </IonButton>

                    <IonButton
                        fill="clear"
                        className={`primary-button no-padding ${!allRequiredFieldsAreFilled() ? 'disabled' : ''}`}
                        onClick={handleSubmit}
                        disabled={!allRequiredFieldsAreFilled()}
                    >
                        {t('learning_book.create.validate_button')}
                    </IonButton>
                </div>
            </div>
        </div>
    );
};

export default CreateCustomLogEntryContent;
