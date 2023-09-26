import { PlayArrow } from '@mui/icons-material';
import { Modal, Box, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { Button, FilterButton, TopToolbar, useNotify, useTranslate } from 'react-admin';
import { RoutineExecutionStatus } from '../../../entities/RoutineExecution';
import useLastGlobalRoutineExecution from './useLastGlobalRoutineExecution';
import useLaunchGlobalRoutine from './useLaunchGlobalRoutine';

interface ActionsProps {
    universityIds: string[];
    enableLaunchGlobalRoutine?: boolean;
}

const Actions = ({ universityIds, enableLaunchGlobalRoutine }: ActionsProps) => {
    const translate = useTranslate();
    const notify = useNotify();

    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState<boolean>(false);

    const {
        data: lastGlobalRoutineExecution,
        isLoading: isLoadingLastGlobalRoutine,
        refetch: refetchGlobalRoutine,
    } = useLastGlobalRoutineExecution();

    const globalRoutineIsCurrentlyRunning = lastGlobalRoutineExecution?.status === RoutineExecutionStatus.ON_GOING;

    const { mutate, isLoading } = useLaunchGlobalRoutine({
        onSuccess: async () => {
            setConfirmModalIsOpen(false);
            await refetchGlobalRoutine();
        },
        onError: (err: unknown) => {
            console.error(err);
            notify(translate('learning_languages.list.globalRoutineModal.error'), { type: 'error' });
        },
    });
    const handleConfirm = () => {
        mutate(universityIds);
    };

    if (!enableLaunchGlobalRoutine) {
        return (
            <TopToolbar>
                <FilterButton disableSaveQuery />
            </TopToolbar>
        );
    }

    return (
        <>
            <TopToolbar>
                <FilterButton disableSaveQuery />
                {isLoadingLastGlobalRoutine && <CircularProgress size={15} />}
                {!isLoadingLastGlobalRoutine && globalRoutineIsCurrentlyRunning && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 0.5 }}>
                        <CircularProgress size={15} />
                        <span>{translate('learning_languages.list.actions.globalRoutine.runningLabel')}</span>
                    </Box>
                )}
                {!isLoadingLastGlobalRoutine && !globalRoutineIsCurrentlyRunning && (
                    <Button
                        color="secondary"
                        label={translate('learning_languages.list.actions.globalRoutine.ctaLabel')}
                        onClick={() => setConfirmModalIsOpen(true)}
                        startIcon={<PlayArrow />}
                        variant="text"
                    />
                )}
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

export default Actions;
