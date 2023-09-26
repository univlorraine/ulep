import { Check, Clear } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Modal } from '@mui/material';
import React, { useState } from 'react';
import { Button, useNotify, useTranslate } from 'react-admin';
import useCreateTandem from './useCreateTandem';
import useRefuseTandem from './useRefuseTandem';
import useValidateTandem from './useValidateTandem';

enum TandemAction {
    ACCEPT = 'ACCEPT',
    REFUSE = 'REFUSE',
}

interface TandemActionsProps {
    tandemId?: string;
    learningLanguageIds?: string[];
    onTandemAction: () => void;
    relaunchGlobalRoutineOnRefuse?: boolean;
    relaunchGlobalRoutineOnAccept?: boolean;
}

const TandemActions = ({
    tandemId,
    learningLanguageIds,
    onTandemAction,
    relaunchGlobalRoutineOnRefuse,
    relaunchGlobalRoutineOnAccept,
}: TandemActionsProps) => {
    if (!tandemId && learningLanguageIds?.length !== 2) {
        throw new Error('TandemActions must have a tandemId or 2 learningLanguage Ids');
    }

    const translate = useTranslate();

    const [modalAction, setModalAction] = useState<TandemAction>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalAction(undefined);
    };

    const handleAction = (action: TandemAction) => {
        setModalAction(action);
        setIsModalOpen(true);
    };

    const onSuccess = async () => {
        onTandemAction();
        handleCloseModal();
    };

    const notify = useNotify();
    const onError = async () => {
        notify(translate('learning_languages.show.tandems.actions.error'), { type: 'error' });
    };

    const { mutate: validateTandem, isLoading: isLoadingValidateTandem } = useValidateTandem({
        onSuccess,
        onError,
    });
    const { mutate: createTandem, isLoading: isLoadingCreateTandem } = useCreateTandem({
        onSuccess,
        onError,
    });

    const { mutate: refuseTandem, isLoading: isLoadingRefuseTandem } = useRefuseTandem({
        onSuccess,
        onError,
    });

    const handleConfirm = () => {
        if (modalAction === TandemAction.ACCEPT) {
            if (tandemId) {
                validateTandem(tandemId);
            } else if (learningLanguageIds) {
                createTandem({
                    learningLanguageIds,
                    relaunch: relaunchGlobalRoutineOnAccept,
                });
            }
        } else {
            if (learningLanguageIds?.length !== 2) {
                throw new Error('Must have 2 learning languages to refuse tandem');
            }
            refuseTandem({
                learningLanguageIds,
                relaunch: relaunchGlobalRoutineOnRefuse,
            });
        }
    };

    const message =
        modalAction === TandemAction.ACCEPT
            ? translate('learning_languages.show.tandems.actions.validateMessage')
            : translate('learning_languages.show.tandems.actions.refuseMessage');

    return (
        <>
            <Modal
                aria-describedby="modal-modal-description"
                aria-labelledby="modal-modal-title"
                onClose={handleCloseModal}
                open={isModalOpen}
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
                    {isLoadingValidateTandem || isLoadingCreateTandem || isLoadingRefuseTandem ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <p>{message}</p>
                            <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-around' }}>
                                <Button
                                    label={translate('learning_languages.show.tandems.actions.ctaLabels.cancel')}
                                    onClick={handleCloseModal}
                                    variant="text"
                                />
                                <Button
                                    color="error"
                                    label={translate('learning_languages.show.tandems.actions.ctaLabels.confirm')}
                                    onClick={handleConfirm}
                                    variant="outlined"
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
            <IconButton aria-label="accept" color="success" onClick={() => handleAction(TandemAction.ACCEPT)}>
                <Check />
            </IconButton>
            <IconButton aria-label="reject" color="error" onClick={() => handleAction(TandemAction.REFUSE)}>
                <Clear />
            </IconButton>
        </>
    );
};

export default TandemActions;
