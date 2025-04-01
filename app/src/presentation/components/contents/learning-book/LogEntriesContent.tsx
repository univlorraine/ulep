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

import { IonButton, IonIcon, IonImg, IonItem, IonLabel, IonList } from '@ionic/react';
import { arrowRedoOutline, downloadOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg } from '../../../../assets';
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
import useGetLogEntries from '../../../hooks/useGetLogEntries';
import LogEntriesCard from '../../card/LogEntriesCard';
import LogEntryCard from '../../card/LogEntryCard';
import HeaderSubContent from '../../HeaderSubContent';
import Loader from '../../Loader';
import styles from './LogEntriesContent.module.css';

interface LogEntriesContentProps {
    onAddCustomLogEntry: () => void;
    onUpdateCustomLogEntry: (logEntry: LogEntry) => void;
    onOpenVocabularyList: (vocabularyListId: string) => void;
    onOpenActivity: (activityId: string) => void;
    onFocusLogEntryForADay: (date: Date) => void;
    onBackPressed: () => void;
    onShareLogEntries: () => void;
    onUnshareLogEntries: () => void;
    onShareLogEntriesForResearch: () => void;
    onUnshareLogEntriesForResearch: () => void;
    onExportLogEntries: () => void;
    profile: Profile;
    learningLanguage: LearningLanguage;
    isModal?: boolean;
    isShared: boolean;
    isSharedForResearch: boolean;
}

export const LogEntriesContent: React.FC<LogEntriesContentProps> = ({
    onAddCustomLogEntry,
    onUpdateCustomLogEntry,
    onOpenVocabularyList,
    onOpenActivity,
    onBackPressed,
    onFocusLogEntryForADay,
    onExportLogEntries,
    onShareLogEntries,
    onUnshareLogEntries,
    onShareLogEntriesForResearch,
    onUnshareLogEntriesForResearch,
    profile,
    learningLanguage,
    isModal,
    isShared,
    isSharedForResearch,
}) => {
    const { t } = useTranslation();
    const [refresh, setRefresh] = useState<boolean>(false);

    const { logEntriesResult, isPaginationEnded, handleOnEndReached } = useGetLogEntries(learningLanguage.id, false);

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

    return (
        <div style={{ paddingTop: 0 }}>
            <HeaderSubContent
                title={t('learning_book.list.title')}
                onBackPressed={onBackPressed}
                isBackButton={isModal}
                kebabContent={(closeMenu) => (
                    <IonList lines="none">
                        <IonItem
                            button={true}
                            detail={false}
                            onClick={async () => {
                                if (isShared) {
                                    await onUnshareLogEntries();
                                } else {
                                    await onShareLogEntries();
                                }
                                setRefresh(!refresh);
                                closeMenu();
                            }}
                        >
                            <IonIcon icon={arrowRedoOutline} aria-hidden="true" />
                            <IonLabel className={styles['popover-label']}>
                                {isShared ? t('learning_book.list.unshare.title') : t('learning_book.list.share.title')}
                            </IonLabel>
                        </IonItem>
                        {isShared && (
                            <IonItem
                                button={true}
                                detail={false}
                                onClick={async () => {
                                    if (isSharedForResearch) {
                                        await onUnshareLogEntriesForResearch();
                                    } else {
                                        await onShareLogEntriesForResearch();
                                    }
                                    setRefresh(!refresh);
                                    closeMenu();
                                }}
                            >
                                <IonIcon icon={arrowRedoOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>
                                    {isSharedForResearch
                                        ? t('learning_book.list.unshareforresearch.title')
                                        : t('learning_book.list.shareforresearch.title')}
                                </IonLabel>
                            </IonItem>
                        )}
                        <IonItem
                            button={true}
                            detail={false}
                            onClick={() => {
                                onExportLogEntries();
                                closeMenu();
                            }}
                        >
                            <IonIcon icon={downloadOutline} aria-hidden="true" />
                            <IonLabel className={styles['popover-label']}>
                                {t('learning_book.list.export.title')}
                            </IonLabel>
                        </IonItem>
                    </IonList>
                )}
            />
            <div className={styles['log-entries-list']}>
                <div className={styles['log-entries-list-container']}>
                    {logEntriesResult.logEntries
                        .filter((logEntry) => logEntry.count > 0 && logEntry.entries.length > 0)
                        .map((logEntry) => {
                            if (logEntry.count > 1 && logEntry.entries.length > 1) {
                                return (
                                    <LogEntriesCard
                                        key={logEntry.date.toISOString()}
                                        date={logEntry.date}
                                        logEntries={logEntry.entries}
                                        count={logEntry.count}
                                        profile={profile}
                                        onClick={onFocusLogEntryForADay}
                                    />
                                );
                            }
                            return (
                                <LogEntryCard
                                    key={logEntry.entries[0].id}
                                    logEntry={logEntry.entries[0]}
                                    profile={profile}
                                    onClick={handleOnPress}
                                    shouldDisplayDate
                                />
                            );
                        })}
                </div>
                {logEntriesResult.isLoading && <Loader />}
                {!logEntriesResult.isLoading && !isPaginationEnded && (
                    <IonButton fill="clear" className="secondary-button" onClick={handleOnEndReached}>
                        {t('learning_book.list.load_more')}
                    </IonButton>
                )}
            </div>

            <IonButton fill="clear" className="add-button" onClick={() => onAddCustomLogEntry()}>
                <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
            </IonButton>
        </div>
    );
};

export default LogEntriesContent;
