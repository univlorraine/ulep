import { PlayArrow } from '@mui/icons-material';
import { Modal, Box, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { Button, Datagrid, DateField, FunctionField, List, TextField, TopToolbar, useNotify } from 'react-admin';
import UniversitiesPicker from '../../components/UniversitiesPicker';
import { LearningLanguage } from '../../entities/LearningLanguage';
import { getProfileDisplayName } from '../../entities/Profile';
import useLaunchGlobalRoutine from './useLaunchGlobalRoutine';
import useLearningLanguagesStore from './useLearningLanguagesStore';

interface ActionsProps {
    universityIds: string[];
}

const Actions = ({ universityIds }: ActionsProps) => {
    const notify = useNotify();

    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState<boolean>(false);

    const { mutate, isLoading } = useLaunchGlobalRoutine({
        onSuccess: () => {
            setConfirmModalIsOpen(false);
        },
        onError: (err: unknown) => {
            console.error(err);
            notify('TODO(NOW+1): An error occured while launching global routine', { type: 'error' });
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
                    label="Lancer la routine globale"
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
                            <p>Lancer la routine globale peut prendre quelques minutes.</p>
                            <p>Les tandems proposés par l&lsquo;ancienne exécution seront perdus.</p>
                            <p>Voulez vous-continuer ?</p>
                            <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-around' }}>
                                <Button label="Cancel" onClick={() => setConfirmModalIsOpen(false)} variant="text" />
                                <Button color="error" label="Confirm" onClick={handleConfirm} variant="outlined" />
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

// TODO(NOW): translations

const LearningLanguageList = () => {
    // TODO(NOW+2): manage different case user from university central / university partner
    const { selectedUniversityIds, setSelectedUniversityIds } = useLearningLanguagesStore();

    return (
        <>
            <div>
                <UniversitiesPicker onSelected={(ids) => setSelectedUniversityIds(ids)} value={selectedUniversityIds} />
            </div>
            <div>
                {selectedUniversityIds.length ? (
                    <List<LearningLanguage>
                        actions={<Actions universityIds={selectedUniversityIds} />}
                        exporter={false}
                        filter={{ universityIds: selectedUniversityIds }}
                        title="TODO.Translate"
                    >
                        <Datagrid bulkActionButtons={false} rowClick="show">
                            <FunctionField
                                label="Name"
                                render={(record: LearningLanguage) => getProfileDisplayName(record.profile)}
                            />
                            <TextField label="learned language" sortable={false} source="name" />
                            <TextField label="level" sortable={false} source="level" />
                            <DateField label="Créé le" sortable={false} source="createdAt" />
                        </Datagrid>
                    </List>
                ) : (
                    <div>
                        <span>Merci de sélectionner une ou plusieurs universités pour voir les demandes</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default LearningLanguageList;
