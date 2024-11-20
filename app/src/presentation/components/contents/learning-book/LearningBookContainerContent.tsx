import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useConfig } from '../../../../context/ConfigurationContext';
import { LogEntry, LogEntryCustomEntry, LogEntryType } from '../../../../domain/entities/LogEntry';
import Profile from '../../../../domain/entities/Profile';
import CreateCustomLogEntryContent from './CreateOrUpdateCustomLogEntryContent';
import LogEntriesContent from './LogEntriesContent';

interface LearningBookContainerContentProps {
    onClose: () => void;
    profile: Profile;
}

const LearningBookContainerContent: React.FC<LearningBookContainerContentProps> = ({ onClose, profile }) => {
    const { createLogEntry, updateCustomLogEntry } = useConfig();
    const [showToast] = useIonToast();
    const [isCreateCustomLogEntry, setIsCreateCustomLogEntry] = useState<boolean>(false);
    const [logEntryToUpdate, setLogEntryToUpdate] = useState<LogEntryCustomEntry | undefined>();

    const createorUpdateCustomLogEntry = async ({
        date,
        title,
        description,
    }: {
        date: Date;
        title: string;
        description: string;
    }) => {
        let result;
        if (logEntryToUpdate) {
            result = await updateCustomLogEntry.execute(logEntryToUpdate.id, {
                date,
                title,
                content: description,
            });
        } else {
            result = await createLogEntry.execute({
                type: LogEntryType.CUSTOM_ENTRY,
                metadata: {
                    date,
                    title,
                    content: description,
                },
            });
        }

        if (result instanceof Error) {
            showToast(result.message);
        }

        setIsCreateCustomLogEntry(false);
        setLogEntryToUpdate(undefined);
    };

    const handleUpdateCustomLogEntry = (logEntry: LogEntry) => {
        if (logEntry instanceof LogEntryCustomEntry) {
            setLogEntryToUpdate(logEntry);
            setIsCreateCustomLogEntry(true);
        }
    };

    return (
        <>
            {isCreateCustomLogEntry ? (
                <CreateCustomLogEntryContent
                    onBackPressed={() => setIsCreateCustomLogEntry(false)}
                    onSubmit={createorUpdateCustomLogEntry}
                    profile={profile}
                    logEntryToUpdate={logEntryToUpdate}
                />
            ) : (
                <LogEntriesContent
                    onAddCustomLogEntry={() => setIsCreateCustomLogEntry(true)}
                    onUpdateCustomLogEntry={handleUpdateCustomLogEntry}
                    onBackPressed={onClose}
                    profile={profile}
                    isModal={false}
                />
            )}
        </>
    );
};

export default LearningBookContainerContent;
