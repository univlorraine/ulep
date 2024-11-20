import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { JournalSvg, StarPng } from '../../../assets';
import { LogEntry, LogEntryConnection, LogEntryCustomEntry } from '../../../domain/entities/LogEntry';
import Profile from '../../../domain/entities/Profile';
import styles from './LogEntryCard.module.css';

interface LogEntrySubComponentProps {
    logEntry: LogEntry;
}
interface LogEntryButtonProps {
    logEntry: LogEntry;
    onClick: (logEntry: LogEntry) => void;
}

const getLogEntryImage = (logEntry: LogEntry): string | undefined => {
    if (logEntry instanceof LogEntryCustomEntry) {
        return JournalSvg;
    } else if (logEntry instanceof LogEntryConnection) {
        return StarPng;
    }
    return undefined;
};

const LogEntryTitle: React.FC<LogEntrySubComponentProps> = ({ logEntry }) => {
    const { t } = useTranslation();
    if (logEntry instanceof LogEntryCustomEntry) {
        return logEntry.title;
    } else if (logEntry instanceof LogEntryConnection) {
        return <>{t('learning_book.entry.connection.title')}</>;
    }
    return <>{t('learning_book.entry.default.title')}</>;
};

const LogEntrySubTitle: React.FC<LogEntrySubComponentProps> = ({ logEntry }) => {
    const { t } = useTranslation();
    if (logEntry instanceof LogEntryCustomEntry) {
        return logEntry.content;
    } else if (logEntry instanceof LogEntryConnection) {
        return <></>;
    }
    return <></>;
};

const LogEntryButton: React.FC<LogEntryButtonProps> = ({ logEntry, onClick }) => {
    const { t } = useTranslation();
    if (logEntry instanceof LogEntryCustomEntry) {
        return (
            <IonButton fill="clear" className="primary-button no-padding" onClick={() => onClick(logEntry)}>
                {t('learning_book.entry.custom.button')}
            </IonButton>
        );
    } else if (logEntry instanceof LogEntryConnection) {
        return <></>;
    }
    return <></>;
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
            <span className={styles.title}>
                <LogEntryTitle logEntry={logEntry} />
            </span>
            <span className={styles.subtitle}>
                <LogEntrySubTitle logEntry={logEntry} />
            </span>
            <LogEntryButton logEntry={logEntry} onClick={onClick} />
        </div>
    );
};

export default LogEntryCard;
