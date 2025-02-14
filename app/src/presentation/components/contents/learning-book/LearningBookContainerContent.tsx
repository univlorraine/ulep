import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../../context/ConfigurationContext';
import LearningLanguage from '../../../../domain/entities/LearningLanguage';
import { LogEntry, LogEntryCustomEntry, LogEntryType } from '../../../../domain/entities/LogEntry';
import Profile from '../../../../domain/entities/Profile';
import CreateCustomLogEntryContent from './CreateOrUpdateCustomLogEntryContent';
import LogEntriesByDateContent from './LogEntriesByDateContent';
import LogEntriesContent from './LogEntriesContent';

interface LearningBookContainerContentProps {
    onClose: () => void;
    onOpenVocabularyList: (vocabularyListId: string) => void;
    onOpenActivity: (activityId: string) => void;
    profile: Profile;
    learningLanguage: LearningLanguage;
    openNewEntry?: boolean;
}

const LearningBookContainerContent: React.FC<LearningBookContainerContentProps> = ({
    onClose,
    onOpenVocabularyList,
    onOpenActivity,
    profile,
    learningLanguage,
    openNewEntry,
}) => {
    const { t } = useTranslation();
    const { createLogEntry, updateCustomLogEntry, shareLogEntries, exportLogEntries, unshareLogEntries } = useConfig();
    const [showToast] = useIonToast();
    const [isCreateCustomLogEntry, setIsCreateCustomLogEntry] = useState<boolean>(false);
    const [logEntryToUpdate, setLogEntryToUpdate] = useState<LogEntryCustomEntry | undefined>();
    const [focusLogEntryForADay, setFocusLogEntryForADay] = useState<Date | undefined>();
    const [isShared, setIsShared] = useState<boolean>(Boolean(learningLanguage.sharedLogsDate));

    useEffect(() => {
        if (openNewEntry) {
            setIsCreateCustomLogEntry(true);
        }
    }, [openNewEntry]);

    const createOrUpdateCustomLogEntry = async ({
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
            result = await updateCustomLogEntry.execute({
                id: logEntryToUpdate.id,
                learningLanguageId: learningLanguage.id,
                metadata: {
                    date,
                    title,
                    content: description,
                },
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
            showToast(t(result.message), 3000);
        }

        setIsCreateCustomLogEntry(false);
        setLogEntryToUpdate(undefined);
    };

    const handleShareLogEntries = async () => {
        const result = await shareLogEntries.execute(learningLanguage.id);
        if (result instanceof Error) {
            showToast(t(result.message), 3000);
        } else {
            showToast(t('learning_book.list.share.success'), 3000);
            setIsShared(true);
        }
    };

    const handleUnshareLogEntries = async () => {
        const result = await unshareLogEntries.execute(learningLanguage.id);
        if (result instanceof Error) {
            showToast(t(result.message), 3000);
        } else {
            showToast(t('learning_book.list.unshare.success'), 3000);
            setIsShared(false);
        }
    };

    const handleExportLogEntries = async () => {
        const result = await exportLogEntries.execute(learningLanguage.id);
        if (result instanceof Error) {
            showToast(t(result.message), 3000);
        } else {
            showToast(t('learning_book.list.export.success'), 3000);
        }
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
                onOpenActivity={onOpenActivity}
                learningLanguage={learningLanguage}
                isModal
            />
        );
    }

    if (isCreateCustomLogEntry) {
        return (
            <CreateCustomLogEntryContent
                onBackPressed={handleOnClose}
                onSubmit={createOrUpdateCustomLogEntry}
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
            onOpenActivity={onOpenActivity}
            onBackPressed={handleOnClose}
            onFocusLogEntryForADay={setFocusLogEntryForADay}
            onShareLogEntries={handleShareLogEntries}
            onUnshareLogEntries={handleUnshareLogEntries}
            onExportLogEntries={handleExportLogEntries}
            learningLanguage={learningLanguage}
            profile={profile}
            isModal={true}
            isShared={isShared}
        />
    );
};

export default LearningBookContainerContent;
