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

import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import { Avatar, Button, Card, CardActions, CircularProgress, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { Form, useLogin, useNotify, useTranslate } from 'react-admin';
import { ssoLogin } from '../../providers/authProvider';
import ForgotPassword from './ForgotPassword';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const translate = useTranslate();
    const [loginError, setLoginError] = useState(false);

    const notify = useNotify();
    const login = useLogin();

    const handleSubmit = () => {
        setLoading(true);
        login({ email, password }).catch((error) => {
            if (error.message === 'Forbidden') {
                notify(translate('login.domainError'));
            } else {
                notify(translate('login.loginError'));
            }
            setLoginError(true);
            setLoading(false);
        });
    };

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setLoginError(false);
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setLoginError(false);
    };

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: '#9e9e9e',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
                <Card sx={{ minWidth: 300, marginTop: '6em' }}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            margin: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <LockIcon />
                        </Avatar>
                    </Box>
                    <Box sx={{ padding: '0 1em 1em 1em' }}>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextField
                                disabled={loading}
                                error={loginError}
                                label={translate('global.email')}
                                onChange={handleChangeEmail}
                                type="email"
                                value={email}
                                autoFocus
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextField
                                disabled={loading}
                                error={loginError}
                                label={translate('login.password')}
                                onChange={handleChangePassword}
                                type="password"
                                value={password}
                                fullWidth
                                required
                            />
                        </Box>
                    </Box>
                    <CardActions
                        sx={{ padding: '0 1em 1em 1em', display: 'flex', flexDirection: 'column', gap: '1em' }}
                    >
                        <Button color="primary" disabled={loading} type="submit" variant="contained" fullWidth>
                            {loading && <CircularProgress size={25} thickness={2} />}
                            {translate('ra.auth.sign_in')}
                        </Button>
                        <ForgotPassword />
                    </CardActions>
                </Card>
                <Card sx={{ minWidth: 300, marginTop: '2em' }}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            margin: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <KeyIcon />
                        </Avatar>
                    </Box>
                    <CardActions sx={{ padding: '0 1em 1em 1em' }}>
                        <Button
                            color="primary"
                            disabled={loading}
                            onClick={ssoLogin}
                            type="button"
                            variant="contained"
                            fullWidth
                        >
                            {translate('global.sso_login')}
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Form>
    );
};

export default LoginPage;
