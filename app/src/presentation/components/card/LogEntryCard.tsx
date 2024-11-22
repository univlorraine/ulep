import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { AvatarPng, JournalSvg, Star2Png } from '../../../assets';
import {
    LogEntry,
    LogEntryConnection,
    LogEntryCustomEntry,
    LogEntryTandemChat,
    LogEntryType,
    LogEntryVisio,
} from '../../../domain/entities/LogEntry';
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
        return Star2Png;
    } else if (logEntry instanceof LogEntryVisio || logEntry instanceof LogEntryTandemChat) {
        return AvatarPng;
    }

    return undefined;
};

const LogEntryTitle: React.FC<LogEntrySubComponentProps> = ({ logEntry }) => {
    const { t } = useTranslation();
    if (logEntry instanceof LogEntryCustomEntry) {
        return logEntry.title;
    } else if (logEntry instanceof LogEntryConnection) {
        return <>{t('learning_book.entry.connection.title')}</>;
    } else if (logEntry instanceof LogEntryTandemChat) {
        return (
            <>
                {t('learning_book.entry.tandem_chat.title', {
                    firstname: logEntry.tandemFirstname,
                    lastname: logEntry.tandemLastname,
                })}
            </>
        );
    } else if (logEntry instanceof LogEntryVisio) {
        return (
            <>
                {t('learning_book.entry.visio.title', {
                    firstname: logEntry.tandemFirstname,
                    lastname: logEntry.tandemLastname,
                })}
            </>
        );
    }

    return <>{t('learning_book.entry.default.title')}</>;
};

const LogEntrySubTitle: React.FC<LogEntrySubComponentProps> = ({ logEntry }) => {
    const { t } = useTranslation();
    if (logEntry instanceof LogEntryCustomEntry) {
        return logEntry.content;
    } else if (logEntry instanceof LogEntryVisio) {
        return (
            <>
                {t('learning_book.entry.visio.subtitle', {
                    minutes: Math.floor(logEntry.duration / 60),
                    seconds: logEntry.duration % 60,
                })}
            </>
        );
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
    } else if (logEntry instanceof LogEntryVisio) {
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
        <div
            className={`${styles.container} ${
                logEntry.type === LogEntryType.VISIO || logEntry.type === LogEntryType.TANDEM_CHAT
                    ? styles.primaryContainer
                    : ''
            }`}
            onClick={() => onClick(logEntry)}
        >
            <div className={styles.line}>
                <p className={styles.date}>{date}</p>
                {image && (
                    <div className={styles.imageContainer}>
                        <img className={styles.image} src={image} aria-hidden />
                    </div>
                )}
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
