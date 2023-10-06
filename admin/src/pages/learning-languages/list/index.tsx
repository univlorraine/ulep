import { Check } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
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
} from 'react-admin';
import { DisplayRole } from '../../../components/translated';
import UniversitiesPicker from '../../../components/UniversitiesPicker';
import { LearningLanguage, learningLanguageHasPossibleAction } from '../../../entities/LearningLanguage';
import { getProfileDisplayName } from '../../../entities/Profile';
import { isTandemActive } from '../../../entities/Tandem';
import University from '../../../entities/University';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import Actions from './Actions';

const LearningLanguageList = () => {
    const translate = useTranslate();
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
    ];

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <Box sx={{ marginTop: 2 }}>
            {identity.isCentralUniversity && (
                <UniversitiesPicker
                    filterUniversities={(university: University) => !!university.parent}
                    label={translate('learning_languages.list.universitiesPicker.label')}
                    onSelected={(ids) => setSelectedUniversityIds(ids)}
                    placeholder={translate('learning_languages.list.universitiesPicker.label')}
                    value={selectedUniversityIds}
                />
            )}
            {(identity.isCentralUniversity && selectedUniversityIds.length) || !identity.isCentralUniversity ? (
                <List<LearningLanguage>
                    actions={
                        <Actions
                            enableLaunchGlobalRoutine={identity.isCentralUniversity}
                            universityIds={[...selectedUniversityIds, identity.universityId]}
                        />
                    }
                    exporter={false}
                    filter={{ universityIds: identity.universityId }}
                    filters={filters}
                >
                    <Datagrid bulkActionButtons={false} rowClick="show">
                        <FunctionField
                            label={translate('learning_languages.list.tableColumns.name')}
                            render={(record: LearningLanguage) => getProfileDisplayName(record.profile)}
                            sortBy="profile.name"
                        />
                        <TextField
                            label={translate('learning_languages.list.tableColumns.learnedLanguage')}
                            source="name"
                            sortable
                        />
                        <TextField label={translate('learning_languages.list.tableColumns.level')} source="level" />
                        <DateField
                            label={translate('learning_languages.list.tableColumns.createdAt')}
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
                    </Datagrid>
                </List>
            ) : (
                <Box sx={{ marginTop: 5, textAlign: 'center' }}>
                    <Typography>{translate('learning_languages.list.noUniversitySelected')}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default LearningLanguageList;
