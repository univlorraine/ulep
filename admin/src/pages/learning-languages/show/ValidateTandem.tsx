import { Check, Clear } from '@mui/icons-material';
import { Box, IconButton, Modal } from '@mui/material';
import React, { useState } from 'react';
import { Button } from 'react-admin';

enum TandemAction {
    VALIDATE = 'VALIDATE',
    REFUSE = 'REFUSE',
}

const ValidateTandem = () => {
    const [modalMessage, setModalMessage] = useState<string>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAction = (action: TandemAction) => {
        switch (action) {
            case TandemAction.VALIDATE:
                setModalMessage('valider le tandem');
                break;
            case TandemAction.REFUSE:
                setModalMessage('refuser le tandem');
                break;
            default:
                throw new Error('Not a tandem action');
        }
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        console.log('confirm');
    };

    return (
        <>
            <Modal
                aria-describedby="modal-modal-description"
                aria-labelledby="modal-modal-title"
                onClose={() => setIsModalOpen(false)}
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
                    <p>Vous êtes sur le point de {modalMessage}. Êtes vous sur ?</p>
                    <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-around' }}>
                        <Button label="Cancel" onClick={() => setIsModalOpen(false)} variant="text" />
                        <Button color="error" label="Confirm" onClick={handleConfirm} variant="outlined" />
                    </Box>
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
