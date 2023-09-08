import { PlayArrow } from '@mui/icons-material';
import { Modal, Box, CircularProgress, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
    Button,
    Datagrid,
    DateField,
    FunctionField,
    List,
    TextField,
    TopToolbar,
    useNotify,
    useTranslate,
} from 'react-admin';
import UniversitiesPicker from '../../components/UniversitiesPicker';
import { LearningLanguage } from '../../entities/LearningLanguage';
import { getProfileDisplayName } from '../../entities/Profile';
import useLaunchGlobalRoutine from './useLaunchGlobalRoutine';
import useLearningLanguagesStore from './useLearningLanguagesStore';

// TODO(NOW+1): refacto by folder

interface ActionsProps {
    universityIds: string[];
}

const Actions = ({ universityIds }: ActionsProps) => {
    const translate = useTranslate();
    const notify = useNotify();

    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState<boolean>(false);

    const { mutate, isLoading } = useLaunchGlobalRoutine({
        onSuccess: () => {
            setConfirmModalIsOpen(false);
        },
        onError: (err: unknown) => {
            console.error(err);
            notify(translate('learning_languages.list.globalRoutineModal.error'), { type: 'error' });
        },
    });
    const handleConfirm = () => {
        mutate(universityIds);
    };

    return (
        <>
            <TopToolbar>
                <Button
                    color="secondary"
                    label={translate('learning_languages.list.actions.globalRoutine.ctaLabel')}
                    onClick={() => setConfirmModalIsOpen(true)}
                    startIcon={<PlayArrow />}
                    variant="text"
                />
            </TopToolbar>
            <Modal
                aria-describedby="modal-modal-description"
                aria-labelledby="modal-modal-title"
                onClose={() => setConfirmModalIsOpen(false)}
                open={confirmModalIsOpen}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 4,
                    }}
                >
                    {isLoading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                                heigh: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <p>{translate('learning_languages.list.globalRoutineModal.description')}</p>
                            <p>{translate('learning_languages.list.globalRoutineModal.confirmMessage')}</p>
                            <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-around' }}>
                                <Button
                                    label={translate('learning_languages.list.globalRoutineModal.ctaLabels.cancel')}
                                    onClick={() => setConfirmModalIsOpen(false)}
                                    variant="text"
                                />
                                <Button
                                    color="error"
                                    label={translate('learning_languages.list.globalRoutineModal.ctaLabels.confirm')}
                                    onClick={handleConfirm}
                                    variant="outlined"
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

// TODO(NOW): translations
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
