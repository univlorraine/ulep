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

import { IonButton, IonDatetime } from '@ionic/react';
import { formatInTimeZone } from 'date-fns-tz';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogEntryCustomEntry } from '../../../../domain/entities/LogEntry';
import Profile from '../../../../domain/entities/Profile';
import { useStoreState } from '../../../../store/storeTypes';
import HeaderSubContent from '../../HeaderSubContent';
import TextInput from '../../TextInput';
import styles from './CreateOrUpdateCustomLogEntryContent.module.css';

interface CreateOrUpdateCustomLogEntryContentProps {
    onBackPressed: () => void;
    onSubmit: (data: { date: Date; title: string; description: string }) => void;
    profile: Profile;
    logEntryToUpdate?: LogEntryCustomEntry;
}

export const CreateOrUpdateCustomLogEntryContent = ({
    onSubmit,
    onBackPressed,
    profile,
    logEntryToUpdate,
}: CreateOrUpdateCustomLogEntryContentProps) => {
    const userTz = profile?.user?.university?.timezone;
    const { t } = useTranslation();
    const [entryDate, setEntryDate] = useState<string>(formatInTimeZone(new Date(), userTz, "yyyy-MM-dd'T'HH:mm"));
    const [entryTitle, setEntryTitle] = useState<string>('');
    const [entryDescription, setEntryDescription] = useState<string>('');
    const language = useStoreState((state) => state.language);

    const formattedDate = new Intl.DateTimeFormat(language || profile?.nativeLanguage?.code, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(entryDate));

    const allRequiredFieldsAreFilled = () => {
        return entryDate && entryTitle;
    };

    const handleSubmit = () => {
        onSubmit({
            date: new Date(entryDate),
            title: entryTitle,
            description: entryDescription,
        });
    };

    useEffect(() => {
        if (logEntryToUpdate) {
            setEntryDate(formatInTimeZone(logEntryToUpdate.createdAt, userTz, "yyyy-MM-dd'T'HH:mm"));
            setEntryTitle(logEntryToUpdate.title);
            if (logEntryToUpdate.content) {
                setEntryDescription(logEntryToUpdate.content);
            }
        }
    }, [logEntryToUpdate]);

    return (
        <div>
            <HeaderSubContent
                title={t(`learning_book.${logEntryToUpdate ? 'update' : 'create'}.title`)}
                onBackPressed={onBackPressed}
                isBackButton
            />
            <div className={styles.container}>
                <p className={styles.date_label}>{t('learning_book.create.date_label')}</p>
                <IonDatetime
                    id="datetime"
                    value={entryDate}
                    max={formatInTimeZone(new Date(), userTz, "yyyy-MM-dd'T'HH:mm")}
                    presentation="date"
                    onIonChange={(e) => setEntryDate(e.detail.value as string)}
                ></IonDatetime>

                <p className={styles.date_value}>{t('learning_book.create.date_value', { date: formattedDate })}</p>

                <TextInput
                    id="input-log-entry-title"
                    title={t('learning_book.create.title_label') as string}
                    placeholder={entryTitle}
                    value={entryTitle}
                    onChange={(title: string) => setEntryTitle(title)}
                />

                <TextInput
                    id="input-log-entry-description"
                    title={t('learning_book.create.description_label') as string}
                    placeholder={entryDescription}
                    value={entryDescription}
                    onChange={(description: string) => setEntryDescription(description)}
                    type="text-area"
                    maxLength={1000}
                    showLimit
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

export default CreateOrUpdateCustomLogEntryContent;
