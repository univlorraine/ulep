import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { LogEntry, LogEntryAddVocabulary, LogEntryCustomEntry } from '../../../../domain/entities/LogEntry';
import Profile from '../../../../domain/entities/Profile';
import useGetLogEntriesByDate from '../../../hooks/useGetLogEntriesByDate';
import LogEntryCard from '../../card/LogEntryCard';
import HeaderSubContent from '../../HeaderSubContent';
import Loader from '../../Loader';
import styles from './LogEntriesByDateContent.module.css';

interface LogEntriesByDateContentProps {
    onUpdateCustomLogEntry: (logEntry: LogEntry) => void;
    onOpenVocabularyList: () => void;
    onBackPressed: () => void;
    profile: Profile;
    date: Date;
    isModal?: boolean;
}

export const LogEntriesByDateContent: React.FC<LogEntriesByDateContentProps> = ({
    onUpdateCustomLogEntry,
    onOpenVocabularyList,
    onBackPressed,
    profile,
    date,
    isModal,
}) => {
    const { t } = useTranslation();

    const { logEntriesResult, isPaginationEnded, handleOnEndReached } = useGetLogEntriesByDate(date);

    const handleOnPress = (logEntry: LogEntry) => {
        if (logEntry instanceof LogEntryCustomEntry) {
            onUpdateCustomLogEntry(logEntry);
        } else if (logEntry instanceof LogEntryAddVocabulary) {
            onOpenVocabularyList();
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
                {!logEntriesResult.isLoading && !isPaginationEnded && (
                    <IonButton fill="clear" className="secondary-button" onClick={handleOnEndReached}>
                        {t('learning_book.entry.load_more')}
                    </IonButton>
                )}
            </div>
        </div>
    );
};

export default LogEntriesByDateContent;
