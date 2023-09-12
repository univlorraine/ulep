import { Check } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import {
    Datagrid,
    DateField,
    FunctionField,
    List,
    Loading,
    SelectInput,
    TextField,
    useGetIdentity,
    useTranslate,
} from 'react-admin';
import UniversitiesPicker from '../../../components/UniversitiesPicker';
import { LearningLanguage, learningLanguageHasPossibleAction } from '../../../entities/LearningLanguage';
import { getProfileDisplayName } from '../../../entities/Profile';
import { isTandemActive } from '../../../entities/Tandem';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import Actions from './Actions';

// TODO(NEXT): manage case where connected user is not from central university

const LearningLanguageList = () => {
    const translate = useTranslate();
    const { selectedUniversityIds, setSelectedUniversityIds } = useLearningLanguagesStore();

    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    useEffect(() => {
        if (identity?.universityId) {
            setSelectedUniversityIds([identity.universityId]);
        }
    }, [identity]);

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

    // TODO(NOW+1): admin from partner university should known about on going routine ?

    return (
        <Box sx={{ marginTop: 2 }}>
            {identity.isCentralUniversity && (
                <UniversitiesPicker onSelected={(ids) => setSelectedUniversityIds(ids)} value={selectedUniversityIds} />
            )}
            {selectedUniversityIds.length ? (
                <List<LearningLanguage>
                    actions={
                        <Actions
                            enableLaunchGlobalRoutine={identity.isCentralUniversity}
                            universityIds={selectedUniversityIds}
                        />
                    }
                    exporter={false}
                    filter={{ universityIds: selectedUniversityIds }}
                    filters={filters}
                >
                    <Datagrid bulkActionButtons={false} rowClick="show">
                        <FunctionField
                            label={translate('learning_languages.list.tableColumns.name')}
                            render={(record: LearningLanguage) => getProfileDisplayName(record.profile)}
                            sortBy="profile.name"
                        />
                        <TextField
                            label={translate('learning_languages.list.tableColumns.university')}
                            source="profile.user.university.name"
                            sortable
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
