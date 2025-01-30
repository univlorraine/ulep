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
    onExportLogEntries: () => void;
    profile: Profile;
    learningLanguage: LearningLanguage;
    isModal?: boolean;
    isShared: boolean;
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
    profile,
    learningLanguage,
    isModal,
    isShared,
}) => {
    const { t } = useTranslation();
    const [refresh, setRefresh] = useState<boolean>(false);

    const { logEntriesResult, isPaginationEnded, handleOnEndReached } = useGetLogEntries(learningLanguage.id, false);

    const handleOnPress = (logEntry: LogEntry) => {
        if (logEntry instanceof LogEntryCustomEntry) {
            onUpdateCustomLogEntry(logEntry);
        } else if (logEntry instanceof LogEntryAddVocabulary || logEntry instanceof LogEntryShareVocabulary) {
            onOpenVocabularyList(logEntry.vocabularyListId);
        } else if (logEntry instanceof LogEntryEditActivity || logEntry instanceof LogEntrySubmitActivity) {
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
                    {logEntriesResult.logEntries.map((logEntry) => {
                        if (logEntry.count > 1) {
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
