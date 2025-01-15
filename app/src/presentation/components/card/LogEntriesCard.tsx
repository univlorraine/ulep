import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { LogEntry } from '../../../domain/entities/LogEntry';
import Profile from '../../../domain/entities/Profile';
import { getLogEntryImage, LogEntrySubTitle, LogEntryTitle } from './LogEntryCard';
import styles from './LogEntryCard.module.css';

interface LogEntriesCardProps {
    logEntries: LogEntry[];
    date: Date;
    count: number;
    onClick: (date: Date) => void;
    profile: Profile;
}

const LogEntriesCard: React.FC<LogEntriesCardProps> = ({ date, logEntries, count, onClick, profile }) => {
    const { t } = useTranslation();
    const formattedDate = new Intl.DateTimeFormat(profile.nativeLanguage.code, {
        day: '2-digit',
        month: '2-digit',
    }).format(date);
    return (
        <div className={styles.container} onClick={() => onClick(date)}>
            <div className={styles.line}>
                <p className={styles.date}>{formattedDate}</p>
                <div className={styles.images}>
                    {logEntries.length > 0 &&
                        logEntries.map((logEntry) => (
                            <div className={styles.imageContainer}>
                                <img className={styles.image} src={getLogEntryImage(logEntry)} aria-hidden />
                            </div>
                        ))}
                </div>
            </div>
            <span className={styles.title}>
                <LogEntryTitle logEntry={logEntries[0]}></LogEntryTitle>
                <span className={styles.count}>{`, +${count}`}</span>
            </span>
            <LogEntrySubTitle logEntry={logEntries[0]} />
            <IonButton fill="clear" className="primary-button no-padding" onClick={() => onClick(date)}>
                {t('learning_book.entry.see_more')}
            </IonButton>
        </div>
    );
};

export default LogEntriesCard;
