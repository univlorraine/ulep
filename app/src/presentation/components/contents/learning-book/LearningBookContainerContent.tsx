import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useConfig } from '../../../../context/ConfigurationContext';
import { LogEntryType } from '../../../../domain/entities/LogEntry';
import Profile from '../../../../domain/entities/Profile';
import CreateCustomLogEntryContent from './CreateCustomLogentryContent';
import LogEntriesContent from './LogEntriesContent';

interface LearningBookContainerContentProps {
    onClose: () => void;
    profile: Profile;
}

const LearningBookContainerContent: React.FC<LearningBookContainerContentProps> = ({ onClose, profile }) => {
    const { createLogEntry } = useConfig();
    const [showToast] = useIonToast();
    const [isCreateCustomLogEntry, setIsCreateCustomLogEntry] = useState<boolean>(false);

    const createCustomLogEntry = async ({
        date,
        title,
        description,
    }: {
        date: Date;
        title: string;
        description: string;
    }) => {
        const result = await createLogEntry.execute({
            type: LogEntryType.CUSTOM_ENTRY,
            metadata: {
                date,
                title,
                content: description,
            },
        });

        if (result instanceof Error) {
            showToast(result.message);
        }
    };

    return (
        <>
            {isCreateCustomLogEntry ? (
                <CreateCustomLogEntryContent
                    onBackPressed={() => setIsCreateCustomLogEntry(false)}
                    onSubmit={createCustomLogEntry}
                    profile={profile}
                />
            ) : (
                <LogEntriesContent
                    onAddCustomLogEntry={() => setIsCreateCustomLogEntry(true)}
                    onBackPressed={onClose}
                    profile={profile}
                    isModal={false}
                />
            )}
        </>
    );
};

export default LearningBookContainerContent;
