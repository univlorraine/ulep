import { IonButton, IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { AddSvg } from '../../../../assets';
import { LogEntry } from '../../../../domain/entities/LogEntry';
import Profile from '../../../../domain/entities/Profile';
import useGetLogEntries from '../../../hooks/useGetLogEntries';
import LogEntryCard from '../../card/LogEntryCard';
import HeaderSubContent from '../../HeaderSubContent';
import Loader from '../../Loader';
import styles from './LogEntriesContent.module.css';

interface LogEntriesContentProps {
    onAddCustomLogEntry: () => void;
    onBackPressed: () => void;
    profile: Profile;
    isModal?: boolean;
}

export const LogEntriesContent: React.FC<LogEntriesContentProps> = ({
    onAddCustomLogEntry,
    onBackPressed,
    profile,
    isModal,
}) => {
    const { t } = useTranslation();

    const { logEntries, isLoading } = useGetLogEntries(false);

    return (
        <div style={{ paddingTop: 0 }}>
            <HeaderSubContent title={t('logbook.list.title')} onBackPressed={onBackPressed} isBackButton={isModal} />
            <div className={styles['log-entries-list']}>
                <div className={styles['log-entries-list-container']}>
                    {logEntries.map((logEntry) => (
                        <LogEntryCard
                            key={logEntry.id}
                            logEntry={logEntry}
                            profile={profile}
                            onClick={function (logEntry: LogEntry): void {
                                throw new Error('Function not implemented.');
                            }}
                        />
                    ))}
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
