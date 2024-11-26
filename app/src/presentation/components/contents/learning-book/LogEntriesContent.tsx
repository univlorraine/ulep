import { IonButton, IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { AddSvg } from '../../../../assets';
import { LogEntry, LogEntryAddVocabulary, LogEntryCustomEntry } from '../../../../domain/entities/LogEntry';
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
    onOpenVocabularyList: () => void;
    onBackPressed: () => void;
    profile: Profile;
    isModal?: boolean;
}

export const LogEntriesContent: React.FC<LogEntriesContentProps> = ({
    onAddCustomLogEntry,
    onUpdateCustomLogEntry,
    onOpenVocabularyList,
    onBackPressed,
    profile,
    isModal,
}) => {
    const { t } = useTranslation();

    const { logEntries, isLoading } = useGetLogEntries(false);

    const handleOnPress = (logEntry: LogEntry) => {
        if (logEntry instanceof LogEntryCustomEntry) {
            onUpdateCustomLogEntry(logEntry);
        } else if (logEntry instanceof LogEntryAddVocabulary) {
            onOpenVocabularyList();
        }
    };

    return (
        <div style={{ paddingTop: 0 }}>
            <HeaderSubContent
                title={t('learning_book.list.title')}
                onBackPressed={onBackPressed}
                isBackButton={isModal}
            />
            <div className={styles['log-entries-list']}>
                <div className={styles['log-entries-list-container']}>
                    {logEntries.map((logEntry) => {
                        if (logEntry.count > 1) {
                            return (
                                <LogEntriesCard
                                    key={logEntry.date.toISOString()}
                                    date={logEntry.date}
                                    logEntries={logEntry.entries}
                                    count={logEntry.count}
                                    profile={profile}
                                    onClick={() => {}}
                                />
                            );
                        }
                        return (
                            <LogEntryCard
                                key={logEntry.entries[0].id}
                                logEntry={logEntry.entries[0]}
                                profile={profile}
                                onClick={handleOnPress}
                            />
                        );
                    })}
                </div>
                {isLoading && <Loader />}
            </div>

            <IonButton fill="clear" className="add-button" onClick={() => onAddCustomLogEntry()}>
                <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
            </IonButton>
        </div>
    );
};

export default LogEntriesContent;
