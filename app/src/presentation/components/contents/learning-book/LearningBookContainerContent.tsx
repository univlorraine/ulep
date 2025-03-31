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
    const {
        createLogEntry,
        updateCustomLogEntry,
        shareLogEntries,
        exportLogEntries,
        unshareLogEntries,
        shareLogEntriesForResearch,
        unshareLogEntriesForResearch,
    } = useConfig();
    const [showToast] = useIonToast();
    const [isCreateCustomLogEntry, setIsCreateCustomLogEntry] = useState<boolean>(false);
    const [logEntryToUpdate, setLogEntryToUpdate] = useState<LogEntryCustomEntry | undefined>();
    const [focusLogEntryForADay, setFocusLogEntryForADay] = useState<Date | undefined>();
    const [isShared, setIsShared] = useState<boolean>(Boolean(learningLanguage.sharedLogsDate));
    const [isSharedForResearch, setIsSharedForResearch] = useState<boolean>(
        Boolean(learningLanguage.sharedLogsForResearchDate)
    );

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

    const handleShareLogEntriesForResearch = async () => {
        const result = await shareLogEntriesForResearch.execute(learningLanguage.id);
        if (result instanceof Error) {
            showToast(t(result.message), 3000);
        } else {
            showToast(t('learning_book.list.share.success'), 3000);
            setIsSharedForResearch(true);
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

    const handleUnshareLogEntriesForResearch = async () => {
        const result = await unshareLogEntriesForResearch.execute(learningLanguage.id);
        if (result instanceof Error) {
            showToast(t(result.message), 3000);
        } else {
            showToast(t('learning_book.list.unshare.success'), 3000);
            setIsSharedForResearch(false);
        }
    };

    const handleExportLogEntries = async () => {
        const firstName = learningLanguage.profile?.user?.firstname.replace(' ', '_');
        const lastName = learningLanguage.profile?.user?.lastname.replace(' ', '_');
        const fileName = `${firstName}-${lastName}-learning-log-${learningLanguage.code}.csv`;
        const result = await exportLogEntries.execute(learningLanguage.id, fileName);
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
        if (isCreateCustomLogEntry) {
            return setIsCreateCustomLogEntry(false);
        } else if (focusLogEntryForADay) {
            return setFocusLogEntryForADay(undefined);
        } else {
            return onClose();
        }
    };

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
            onShareLogEntriesForResearch={handleShareLogEntriesForResearch}
            onUnshareLogEntriesForResearch={handleUnshareLogEntriesForResearch}
            onExportLogEntries={handleExportLogEntries}
            learningLanguage={learningLanguage}
            profile={profile}
            isModal={true}
            isShared={isShared}
            isSharedForResearch={isSharedForResearch}
        />
    );
};

export default LearningBookContainerContent;
