import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { AvatarPng, DicesPng, FicheSvg, JournalSvg, Star2Png, VocabularyPng } from '../../../assets';
import {
    LogEntry,
    LogEntryAddVocabulary,
    LogEntryConnection,
    LogEntryCustomEntry,
    LogEntryEditActivity,
    LogEntryPlayedGame,
    LogEntryShareVocabulary,
    LogEntrySharingLogs,
    LogEntrySubmitActivity,
    LogEntryTandemChat,
    LogEntryType,
    LogEntryVisio,
} from '../../../domain/entities/LogEntry';
import Profile from '../../../domain/entities/Profile';
import { useStoreState } from '../../../store/storeTypes';
import styles from './LogEntryCard.module.css';

interface LogEntrySubComponentProps {
    logEntry: LogEntry;
}
interface LogEntryButtonProps {
    logEntry: LogEntry;
    onClick: (logEntry: LogEntry) => void;
}

export const getLogEntryImage = (logEntry: LogEntry): string | undefined => {
    if (logEntry instanceof LogEntryCustomEntry) {
        return JournalSvg;
    } else if (logEntry instanceof LogEntryConnection || logEntry instanceof LogEntrySharingLogs) {
        return Star2Png;
    } else if (logEntry instanceof LogEntryAddVocabulary || logEntry instanceof LogEntryShareVocabulary) {
        return VocabularyPng;
    } else if (logEntry instanceof LogEntryVisio || logEntry instanceof LogEntryTandemChat) {
        return AvatarPng;
    } else if (logEntry instanceof LogEntrySubmitActivity || logEntry instanceof LogEntryEditActivity) {
        return FicheSvg;
    } else if (logEntry instanceof LogEntryPlayedGame) {
        return DicesPng;
    }

    return undefined;
};

export const LogEntryTitle: React.FC<LogEntrySubComponentProps> = ({ logEntry }) => {
    const { t } = useTranslation();
    const getTitle = () => {
        if (logEntry instanceof LogEntryCustomEntry) {
            return logEntry.title;
        } else if (logEntry instanceof LogEntryConnection) {
            return <>{t('learning_book.entry.connection.title')}</>;
        } else if (logEntry instanceof LogEntryAddVocabulary) {
            return (
                <>
                    {t('learning_book.entry.add_vocabulary.title', {
                        vocabularyListName: logEntry.vocabularyListName,
                        entryNumber: logEntry.entryNumber,
                    })}
                </>
            );
        } else if (logEntry instanceof LogEntryShareVocabulary) {
            return (
                <>
                    {t('learning_book.entry.share_vocabulary.title', {
                        vocabularyListName: logEntry.vocabularyListName,
                    })}
                </>
            );
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
        } else if (logEntry instanceof LogEntrySubmitActivity) {
            return (
                <>
                    {t('learning_book.entry.submit_activity.title', {
                        activityTitle: logEntry.activityTitle,
                    })}
                </>
            );
        } else if (logEntry instanceof LogEntryEditActivity) {
            return (
                <>
                    {t('learning_book.entry.edit_activity.title', {
                        activityTitle: logEntry.activityTitle,
                    })}
                </>
            );
        } else if (logEntry instanceof LogEntryPlayedGame) {
            return (
                <>
                    {t('learning_book.entry.played_game.title', {
                        gameName: logEntry.gameName,
                    })}
                </>
            );
        } else if (logEntry instanceof LogEntrySharingLogs) {
            return <>{t('learning_book.entry.sharing_logs.title')}</>;
        }

        return <>{t('learning_book.entry.default.title')}</>;
    };

    return <span className={styles.title}>{getTitle()}</span>;
};

export const LogEntrySubTitle: React.FC<LogEntrySubComponentProps> = ({ logEntry }) => {
    const { t } = useTranslation();
    const getSubTitle = () => {
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
        } else if (logEntry instanceof LogEntryPlayedGame) {
            return (
                <>
                    {t('learning_book.entry.played_game.subtitle', {
                        percentage: logEntry.percentage,
                    })}
                </>
            );
        }

        return <></>;
    };

    return <span className={styles.subtitle}>{getSubTitle()}</span>;
};

const getLogEntryButton = (logEntry: LogEntry) => {
    const { t } = useTranslation();
    if (logEntry instanceof LogEntryCustomEntry) {
        return t('learning_book.entry.custom.button');
    } else if (logEntry instanceof LogEntryAddVocabulary || logEntry instanceof LogEntryShareVocabulary) {
        return t('learning_book.entry.add_vocabulary.button');
    } else if (logEntry instanceof LogEntrySubmitActivity || logEntry instanceof LogEntryEditActivity) {
        return t('learning_book.entry.submit_activity.button');
    }
    return undefined;
};

interface LogEntryCardProps {
    logEntry: LogEntry;
    onClick: (logEntry: LogEntry) => void;
    profile: Profile;
    shouldDisplayDate: boolean;
}

const LogEntryCard: React.FC<LogEntryCardProps> = ({ logEntry, onClick, profile, shouldDisplayDate = true }) => {
    const language = useStoreState((state) => state.language);

    const date = new Intl.DateTimeFormat(language || profile.nativeLanguage.code, {
        day: '2-digit',
        month: '2-digit',
    }).format(new Date(logEntry.createdAt));
    const image = getLogEntryImage(logEntry);
    const button = getLogEntryButton(logEntry);

    return (
        <div
            className={`${styles.container} ${
                logEntry.type === LogEntryType.VISIO || logEntry.type === LogEntryType.TANDEM_CHAT
                    ? styles.primaryContainer
                    : ''
            }`}
            onClick={() => onClick(logEntry)}
        >
            {shouldDisplayDate && (
                <div className={styles.line}>
                    <p className={styles.date}>{date}</p>
                    {image && (
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src={image} aria-hidden />
                        </div>
                    )}
                </div>
            )}
            <div className={styles.line}>
                <div className={styles['text-container']} style={{ width: shouldDisplayDate ? '100%' : '80%' }}>
                    <LogEntryTitle logEntry={logEntry} />
                    <LogEntrySubTitle logEntry={logEntry} />
                </div>
                {!shouldDisplayDate && image && (
                    <div className={styles.imageContainer}>
                        <img className={styles.image} src={image} aria-hidden />
                    </div>
                )}
            </div>
            {button && (
                <IonButton fill="clear" className="primary-button no-padding" onClick={() => onClick(logEntry)}>
                    {button}
                </IonButton>
            )}
        </div>
    );
};

export default LogEntryCard;
