import { Check, Clear } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Modal } from '@mui/material';
import React, { useState } from 'react';
import { Button, useNotify } from 'react-admin';
import useCreateTandem from '../useCreateTandem';
import useValidateTandem from '../useValidateTandem';

enum TandemAction {
    VALIDATE = 'VALIDATE',
    REFUSE = 'REFUSE',
}

// TODO(NOW): factorize when creating a tandem from scratch VS updating a DRAFT tandem
// TODO(NOW+2): hide refuse while not implemented

interface ValidateTandemProps {
    tandemId?: string;
    learningLanguageIds?: string[];
    onTandemValidated: () => void;
}

const ValidateTandem = ({ tandemId, learningLanguageIds, onTandemValidated }: ValidateTandemProps) => {
    if (!tandemId && learningLanguageIds?.length !== 2) {
        throw new Error('Validate tandem must have a tandemId or 2 learningLanguage Ids');
    }

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
        onTandemValidated();
        handleCloseModal();
    };

    const notify = useNotify();
    const onError = async () => {
        notify('Une erreur est survenue', { type: 'error' });
    };

    const { mutate: validateTandem, isLoading: isLoadingValidateTandem } = useValidateTandem({
        onSuccess,
        onError,
    });
    const { mutate: createTandem, isLoading: isLoadingCreateTandem } = useCreateTandem({
        onSuccess,
        onError,
    });

    const handleConfirm = () => {
        if (modalAction === TandemAction.VALIDATE) {
            if (tandemId) {
                validateTandem(tandemId);
            } else if (learningLanguageIds) {
                createTandem(learningLanguageIds);
            }
        } else {
            // eslint-disable-next-line no-alert
            window.alert('not implemented yet');
        }
    };

    const message = modalAction === TandemAction.VALIDATE ? 'créer un tandem' : 'rejeter un tandem';

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
                    {isLoadingValidateTandem || isLoadingCreateTandem ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <p>Vous êtes sur le point de {message}. Êtes vous sur ?</p>
                            <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-around' }}>
                                <Button label="Cancel" onClick={handleCloseModal} variant="text" />
                                <Button color="error" label="Confirm" onClick={handleConfirm} variant="outlined" />
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
            <IconButton aria-label="accept" color="success" onClick={() => handleAction(TandemAction.VALIDATE)}>
                <Check />
            </IconButton>
            <IconButton aria-label="reject" color="error" onClick={() => handleAction(TandemAction.REFUSE)}>
                <Clear />
            </IconButton>
        </>
    );
};

export default ValidateTandem;
