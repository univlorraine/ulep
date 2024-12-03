import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useConfig } from '../../../../context/ConfigurationContext';
import LearningLanguage from '../../../../domain/entities/LearningLanguage';
import { LogEntry, LogEntryCustomEntry, LogEntryType } from '../../../../domain/entities/LogEntry';
import Profile from '../../../../domain/entities/Profile';
import CreateCustomLogEntryContent from './CreateOrUpdateCustomLogEntryContent';
import LogEntriesByDateContent from './LogEntriesByDateContent';
import LogEntriesContent from './LogEntriesContent';

interface LearningBookContainerContentProps {
    onClose: () => void;
    onOpenVocabularyList: () => void;
    profile: Profile;
    learningLanguage: LearningLanguage;
}

const LearningBookContainerContent: React.FC<LearningBookContainerContentProps> = ({
    onClose,
    onOpenVocabularyList,
    profile,
    learningLanguage,
}) => {
    const { createLogEntry, updateCustomLogEntry } = useConfig();
    const [showToast] = useIonToast();
    const [isCreateCustomLogEntry, setIsCreateCustomLogEntry] = useState<boolean>(false);
    const [logEntryToUpdate, setLogEntryToUpdate] = useState<LogEntryCustomEntry | undefined>();
    const [focusLogEntryForADay, setFocusLogEntryForADay] = useState<Date | undefined>();

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
                learningLanguageId: learningLanguage.id,
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

    const handleOnClose = () => {
        if (focusLogEntryForADay) {
            setFocusLogEntryForADay(undefined);
        } else if (isCreateCustomLogEntry) {
            setIsCreateCustomLogEntry(false);
        } else {
            onClose();
        }
    };

    if (focusLogEntryForADay) {
        return (
            <LogEntriesByDateContent
                date={focusLogEntryForADay}
                onBackPressed={handleOnClose}
                profile={profile}
                onUpdateCustomLogEntry={handleUpdateCustomLogEntry}
                onOpenVocabularyList={onOpenVocabularyList}
                learningLanguage={profile.learningLanguages[0]}
                isModal
            />
        );
    }

    if (isCreateCustomLogEntry) {
        return (
            <CreateCustomLogEntryContent
                onBackPressed={handleOnClose}
                onSubmit={createorUpdateCustomLogEntry}
                profile={profile}
                logEntryToUpdate={logEntryToUpdate}
            />
        );
    }

    return (
        <LogEntriesContent
            onAddCustomLogEntry={() => setIsCreateCustomLogEntry(true)}
            onUpdateCustomLogEntry={handleUpdateCustomLogEntry}
            onOpenVocabularyList={onOpenVocabularyList}
            onBackPressed={handleOnClose}
            onFocusLogEntryForADay={setFocusLogEntryForADay}
            learningLanguage={learningLanguage}
            profile={profile}
            isModal={true}
        />
    );
};

export default LearningBookContainerContent;
