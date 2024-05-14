import { Check } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';
import {
    Datagrid,
    DateField,
    BooleanField,
    FunctionField,
    List,
    Loading,
    SelectInput,
    TextField,
    useGetIdentity,
    useTranslate,
    TextInput,
    BulkDeleteButton,
    useRefresh,
} from 'react-admin';
import PageTitle from '../../../components/PageTitle';
import { DisplayRole } from '../../../components/translated';
import UniversitiesPicker from '../../../components/UniversitiesPicker';
import Language from '../../../entities/Language';
import { LearningLanguage, learningLanguageHasPossibleAction } from '../../../entities/LearningLanguage';
import { getProfileDisplayName } from '../../../entities/Profile';
import { isTandemActive, isTandemPaused } from '../../../entities/Tandem';
import University, { isCentralUniversity } from '../../../entities/University';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import Actions from './Actions';

const LearningLanguageBulkActionsToolbar = () => <BulkDeleteButton mutationMode="pessimistic" />;

const LearningLanguageList = () => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const { selectedUniversityIds, setSelectedUniversityIds } = useLearningLanguagesStore();

    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    const filters = [
        <SelectInput
            key="actionableTandemFilter"
            choices={[
                { id: true, name: translate('learning_languages.list.filters.actionableTandem.choices.yes') },
                { id: false, name: translate('learning_languages.list.filters.actionableTandem.choices.no') },
            ]}
            label={translate('learning_languages.list.filters.actionableTandem.label')}
            source="hasActionableTandem"
        />,
        <SelectInput
            key="activeTandemFilter"
            choices={[
                { id: true, name: translate('learning_languages.list.filters.activeTandem.choices.yes') },
                { id: false, name: translate('learning_languages.list.filters.activeTandem.choices.no') },
            ]}
            label={translate('learning_languages.list.filters.activeTandem.label')}
            source="hasActiveTandem"
        />,
        <SelectInput
            key="pausedTandemFilter"
            choices={[
                { id: true, name: translate('learning_languages.list.filters.pausedTandem.choices.yes') },
                { id: false, name: translate('learning_languages.list.filters.pausedTandem.choices.no') },
            ]}
            label={translate('learning_languages.list.filters.pausedTandem.label')}
            source="hasPausedTandem"
        />,
        <TextInput
            key="userLastname"
            label={translate('learning_languages.list.filters.user_lastname.label')}
            source="profile.user.lastname"
        />,
    ];

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <Box>
            <PageTitle>{translate('learning_languages.title')}</PageTitle>
            {identity.isCentralUniversity && (
                <UniversitiesPicker
                    filterUniversities={(university: University) => !isCentralUniversity(university)}
                    label={translate('learning_languages.list.universitiesPicker.label')}
                    onSelected={(ids) => setSelectedUniversityIds(ids)}
                    placeholder={translate('learning_languages.list.universitiesPicker.label')}
                    value={selectedUniversityIds}
                />
            )}
            <List<LearningLanguage>
                actions={
                    <Actions
                        enableLaunchGlobalRoutine={identity.isCentralUniversity}
                        onGlobalRoutineEnded={refresh}
                        universityIds={[...selectedUniversityIds, identity.universityId]}
                    />
                }
                exporter={false}
                filter={{
                    universityIds: identity?.isCentralUniversity
                        ? [...selectedUniversityIds, identity.universityId]
                        : identity.universityId,
                }}
                filters={filters}
            >
                <Datagrid bulkActionButtons={<LearningLanguageBulkActionsToolbar />} rowClick="show">
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.name')}
                        render={(record: LearningLanguage) => getProfileDisplayName(record.profile)}
                        sortBy="profile.name"
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.learnedLanguage')}
                        render={(record: Language) => translate(`languages_code.${record.code}`)}
                        sortable={false}
                        source="code"
                    />
                    <TextField label={translate('learning_languages.list.tableColumns.level')} source="level" />
                    <DateField
                        label={translate('learning_languages.list.tableColumns.createdAt')}
                        options={{
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        }}
                        source="createdAt"
                        sortable
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.role')}
                        render={(record: LearningLanguage) => <DisplayRole role={record.profile?.user.role} />}
                        sortBy="profile.user.role"
                    />
                    <BooleanField
                        label={translate('learning_languages.list.tableColumns.specificProgram')}
                        source="specificProgram"
                    />
                    <TextField
                        label={translate('learning_languages.list.tableColumns.university')}
                        source="profile.user.university.name"
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.reported')}
                        render={(record: LearningLanguage) =>
                            record.profile.user.status === 'REPORTED' && (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Check />
                                </Box>
                            )
                        }
                        sortable={false}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.actionPossible')}
                        render={(record: LearningLanguage) =>
                            learningLanguageHasPossibleAction(record) && (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Check />
                                </Box>
                            )
                        }
                        sortable={false}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.hasActiveTandem')}
                        render={(record: LearningLanguage) =>
                            isTandemActive(record.tandem) && (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Check />
                                </Box>
                            )
                        }
                        sortable={false}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.hasPausedTandem')}
                        render={(record: LearningLanguage) =>
                            isTandemPaused(record.tandem) && (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Check />
                                </Box>
                            )
                        }
                        sortable={false}
                    />
                </Datagrid>
            </List>
        </Box>
    );
};

export default LearningLanguageList;
