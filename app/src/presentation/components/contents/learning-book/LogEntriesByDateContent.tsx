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
import { useTranslation } from 'react-i18next';
import LearningLanguage from '../../../../domain/entities/LearningLanguage';
import {
    LogEntry,
    LogEntryAddVocabulary,
    LogEntryCustomEntry,
    LogEntryEditActivity,
    LogEntryPublishActivity,
    LogEntryShareVocabulary,
    LogEntrySubmitActivity,
} from '../../../../domain/entities/LogEntry';
import Profile from '../../../../domain/entities/Profile';
import { useStoreState } from '../../../../store/storeTypes';
import useGetLogEntriesByDate from '../../../hooks/useGetLogEntriesByDate';
import LogEntryCard from '../../card/LogEntryCard';
import HeaderSubContent from '../../HeaderSubContent';
import Loader from '../../Loader';
import styles from './LogEntriesByDateContent.module.css';

interface LogEntriesByDateContentProps {
    onUpdateCustomLogEntry: (logEntry: LogEntry) => void;
    onOpenVocabularyList: (vocabularyListId: string) => void;
    onOpenActivity: (activityId: string) => void;
    onBackPressed: () => void;
    profile: Profile;
    date: Date;
    isModal?: boolean;
    learningLanguage: LearningLanguage;
}

export const LogEntriesByDateContent: React.FC<LogEntriesByDateContentProps> = ({
    onUpdateCustomLogEntry,
    onOpenVocabularyList,
    onOpenActivity,
    onBackPressed,
    profile,
    date,
    isModal,
    learningLanguage,
}) => {
    const { t } = useTranslation();
    const language = useStoreState((state) => state.language);

    const { logEntriesResult, isPaginationEnded, handleOnEndReached } = useGetLogEntriesByDate(
        date,
        learningLanguage.id
    );

    const handleOnPress = (logEntry: LogEntry) => {
        if (logEntry instanceof LogEntryCustomEntry) {
            onUpdateCustomLogEntry(logEntry);
        } else if (logEntry instanceof LogEntryAddVocabulary || logEntry instanceof LogEntryShareVocabulary) {
            onOpenVocabularyList(logEntry.vocabularyListId);
        } else if (
            logEntry instanceof LogEntryEditActivity ||
            logEntry instanceof LogEntrySubmitActivity ||
            logEntry instanceof LogEntryPublishActivity
        ) {
            onOpenActivity(logEntry.activityId);
        }
    };

    const formattedDate = new Intl.DateTimeFormat(language || profile.nativeLanguage.code, {
        day: '2-digit',
        month: '2-digit',
    }).format(date);

    return (
        <div style={{ paddingTop: 0 }}>
            <HeaderSubContent
                title={t('learning_book.entry.title')}
                onBackPressed={onBackPressed}
                isBackButton={isModal}
            />
            <h2 className={styles.date}>{formattedDate}</h2>
            <div className={styles['log-entries-list']}>
                <div className={styles['log-entries-list-container']} role="list">
                    {logEntriesResult.logEntries.map((logEntry) => {
                        return (
                            <LogEntryCard
                                key={logEntry.id}
                                logEntry={logEntry}
                                profile={profile}
                                onClick={handleOnPress}
                                shouldDisplayDate={false}
                            />
                        );
                    })}
                </div>
                {logEntriesResult.isLoading && <Loader />}
            </div>
            {!logEntriesResult.isLoading && !isPaginationEnded && (
                <IonButton fill="clear" className="secondary-button" onClick={handleOnEndReached}>
                    {t('learning_book.entry.load_more')}
                </IonButton>
            )}
        </div>
    );
};

export default LogEntriesByDateContent;
