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

import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { AvatarPng, DicesPng, FicheSvg, JournalSvg, Star2Png, VocabularyPng } from '../../../assets';
import {
    LogEntry,
    LogEntryAddVocabulary,
    LogEntryCustomEntry,
    LogEntryEditActivity,
    LogEntryPlayedGame,
    LogEntryPublishActivity,
    LogEntryShareVocabulary,
    LogEntrySharingLogs,
    LogEntrySubmitActivity,
    LogEntryTandemChat,
    LogEntryType,
    LogEntryUnsharingLogs,
    LogEntryVisio,
} from '../../../domain/entities/LogEntry';
import Profile from '../../../domain/entities/Profile';
import { useStoreState } from '../../../store/storeTypes';
import styles from './LogEntryCard.module.css';

interface LogEntrySubComponentProps {
    logEntry: LogEntry;
}

export const getLogEntryImage = (logEntry: LogEntry): string | undefined => {
    if (logEntry instanceof LogEntryCustomEntry) {
        return JournalSvg;
    } else if (logEntry instanceof LogEntrySharingLogs || logEntry instanceof LogEntryUnsharingLogs) {
        return Star2Png;
    } else if (logEntry instanceof LogEntryAddVocabulary || logEntry instanceof LogEntryShareVocabulary) {
        return VocabularyPng;
    } else if (logEntry instanceof LogEntryVisio || logEntry instanceof LogEntryTandemChat) {
        return AvatarPng;
    } else if (
        logEntry instanceof LogEntrySubmitActivity ||
        logEntry instanceof LogEntryEditActivity ||
        logEntry instanceof LogEntryPublishActivity
    ) {
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
        } else if (logEntry instanceof LogEntryPublishActivity) {
            return (
                <>
                    {t('learning_book.entry.publish_activity.title', {
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
        } else if (logEntry instanceof LogEntryUnsharingLogs) {
            return <>{t('learning_book.entry.unsharing_logs.title')}</>;
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
            const hours = Math.floor(logEntry.duration / 60);
            const minutes = logEntry.duration % 60;
            return (
                <>
                    {t('learning_book.entry.visio.subtitle')}&nbsp;
                    {hours > 0 &&
                        t('learning_book.entry.visio.duration_hour', { count: hours }) + (minutes > 0 ? ' et ' : '')}
                    {minutes > 0 && t('learning_book.entry.visio.duration_minute', { count: minutes })}
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
    } else if (
        logEntry instanceof LogEntrySubmitActivity ||
        logEntry instanceof LogEntryEditActivity ||
        logEntry instanceof LogEntryPublishActivity
    ) {
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
            role="listitem"
            className={`${styles.container} ${
                logEntry.type === LogEntryType.VISIO || logEntry.type === LogEntryType.TANDEM_CHAT
                    ? styles.primaryContainer
                    : ''
            }`}
        >
            {shouldDisplayDate && (
                <div className={styles.line}>
                    <h2 className={styles.date}>{date}</h2>
                    {image && (
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src={image} aria-hidden width={'90px'} />
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
                        <img className={styles.image} src={image} aria-hidden width={'90px'} />
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
