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
