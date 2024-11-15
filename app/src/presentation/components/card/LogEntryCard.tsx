import { useTranslation } from 'react-i18next';
import { StarPng } from '../../../assets';
import { LogEntry, LogEntryType } from '../../../domain/entities/LogEntry';
import Profile from '../../../domain/entities/Profile';
import styles from './LogEntryCard.module.css';

interface LogEntrySubComponentProps {
    logEntry: LogEntry;
}

const getLogEntryImage = (logEntry: LogEntry): string | undefined => {
    switch (logEntry.type) {
        case LogEntryType.CONNECTION:
            return StarPng;
        default:
            return undefined;
    }
};

const LogEntryTitle: React.FC<LogEntrySubComponentProps> = ({ logEntry }) => {
    const { t } = useTranslation();
    switch (logEntry.type) {
        case LogEntryType.CONNECTION:
            return <>{t('learning_book.entry.connection.title')}</>;
        default:
            return <>{t('learning_book.entry.default.title')}</>;
    }
};

const LogEntrySubTitle: React.FC<LogEntrySubComponentProps> = ({ logEntry }) => {
    const { t } = useTranslation();
    switch (logEntry.type) {
        case LogEntryType.CONNECTION:
            return <></>;
        default:
            return <></>;
    }
};

const LogEntryButton: React.FC<LogEntrySubComponentProps> = ({ logEntry }) => {
    const { t } = useTranslation();
    switch (logEntry.type) {
        case LogEntryType.CONNECTION:
            return <></>;
        default:
            return <></>;
    }
};

interface LogEntryCardProps {
    logEntry: LogEntry;
    onClick: (logEntry: LogEntry) => void;
    profile: Profile;
}

const LogEntryCard: React.FC<LogEntryCardProps> = ({ logEntry, onClick, profile }) => {
    const date = new Intl.DateTimeFormat(profile.nativeLanguage.code, {
        day: '2-digit',
        month: '2-digit',
    }).format(new Date(logEntry.createdAt));
    const image = getLogEntryImage(logEntry);

    return (
        <div className={styles.container} onClick={() => onClick(logEntry)}>
            <div className={styles.line}>
                <p className={styles.date}>{date}</p>
                {image && <img className={styles.image} src={image} aria-hidden />}
            </div>
            <LogEntryTitle logEntry={logEntry} />
            <span className={styles.subtitle}>
                <LogEntrySubTitle logEntry={logEntry} />
            </span>
            <LogEntryButton logEntry={logEntry} />
        </div>
    );
};

export default LogEntryCard;
