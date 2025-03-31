/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
        await http('POST', `${window.REACT_APP_API_URL}/authentication/administrators/reset-password`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email }),
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
