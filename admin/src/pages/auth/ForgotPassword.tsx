import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslate } from 'react-admin';
import { http } from '../../providers/authProvider';

const ForgotPassword = () => {
    const translate = useTranslate();
    const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
    const [email, setEmail] = useState('');

    const handleOpenForgotPasswordModal = () => setOpenForgotPasswordModal(true);
    const handleCloseForgotPasswordModal = () => setOpenForgotPasswordModal(false);

    const submitForgotPassword = async () => {
        handleCloseForgotPasswordModal();
        await http('POST', `${process.env.REACT_APP_API_URL}/authentication/reset-password`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                email,
            }),
        });
    };

    const isEmailValid = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    return (
        <>
            <Button
                color="primary"
                onClick={handleOpenForgotPasswordModal}
                sx={{ textTransform: 'none' }}
                type="button"
                fullWidth
            >
                {translate('global.forgot_password')}
            </Button>
            <Modal
                aria-describedby="modal-modal-description"
                aria-labelledby="modal-modal-title"
                onClose={handleCloseForgotPasswordModal}
                open={openForgotPasswordModal}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography component="h2" id="modal-modal-title" variant="h6">
                        {translate('global.forgot_password_modal.title')}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {translate('global.forgot_password_modal.description')}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1em',
                            paddingTop: '2em',
                            paddingBottom: '2em',
                        }}
                    >
                        <TextField
                            color="primary"
                            label={translate('global.email')}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            value={email}
                            fullWidth
                        />
                    </Box>
                    <Button
                        color="primary"
                        disabled={!isEmailValid}
                        onClick={submitForgotPassword}
                        type="button"
                        variant="contained"
                        fullWidth
                    >
                        {translate('global.forgot_password_modal.send_button')}
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default ForgotPassword;
