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

    const formattedDate = new Intl.DateTimeFormat(profile.nativeLanguage.code, {
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
            <h1 className={styles.date}>{formattedDate}</h1>
            <div className={styles['log-entries-list']}>
                <div className={styles['log-entries-list-container']}>
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
