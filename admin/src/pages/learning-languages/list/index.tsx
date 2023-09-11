import { Check } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { Datagrid, DateField, FunctionField, List, TextField, useTranslate } from 'react-admin';
import UniversitiesPicker from '../../../components/UniversitiesPicker';
import { LearningLanguage } from '../../../entities/LearningLanguage';
import { getProfileDisplayName } from '../../../entities/Profile';
import { isTandemActive } from '../../../entities/Tandem';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import Actions from './Actions';

// TODO(NEXT): manage case where connected user is not from central university

const LearningLanguageList = () => {
    const translate = useTranslate();
    const { selectedUniversityIds, setSelectedUniversityIds } = useLearningLanguagesStore();

    return (
        <Box sx={{ marginTop: 2 }}>
            <UniversitiesPicker onSelected={(ids) => setSelectedUniversityIds(ids)} value={selectedUniversityIds} />
            {selectedUniversityIds.length ? (
                <List<LearningLanguage>
                    actions={<Actions universityIds={selectedUniversityIds} />}
                    exporter={false}
                    filter={{ universityIds: selectedUniversityIds }}
                >
                    <Datagrid bulkActionButtons={false} rowClick="show">
                        <FunctionField
                            label={translate('learning_languages.list.tableColumns.name')}
                            render={(record: LearningLanguage) => getProfileDisplayName(record.profile)}
                        />
                        <TextField
                            label={translate('learning_languages.list.tableColumns.university')}
                            source="profile.user.university.name"
                        />
                        <TextField
                            label={translate('learning_languages.list.tableColumns.learnedLanguage')}
                            sortable={false}
                            source="name"
                        />
                        <TextField
                            label={translate('learning_languages.list.tableColumns.level')}
                            sortable={false}
                            source="level"
                        />
                        <DateField
                            label={translate('learning_languages.list.tableColumns.createdAt')}
                            sortable={false}
                            source="createdAt"
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
