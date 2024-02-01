import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import { Avatar, Button, Card, CardActions, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useState } from 'react';
import { Form, required, TextInput, useTranslate, useLogin, useNotify } from 'react-admin';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const notify = useNotify();
    const login = useLogin();

    const handleSubmit = (auth: any) => {
        setLoading(true);
        login(auth).catch(() => {
            notify(translate('login.loginError'));
            setLoading(false);
        });
    };

    const ssoLogin = () => {
        const redirectUri = encodeURI(`${window.location.origin}`);
        window.location.href = `${process.env.REACT_APP_API_URL}/authentication/flow?redirectUri=${redirectUri}`;
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
                            <TextInput
                                disabled={loading}
                                label={translate('global.email')}
                                source="email"
                                validate={required()}
                                autoFocus
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextInput
                                disabled={loading}
                                label={translate('login.password')}
                                source="password"
                                type="password"
                                validate={required()}
                                fullWidth
                            />
                        </Box>
                    </Box>
                    <CardActions sx={{ padding: '0 1em 1em 1em' }}>
                        <Button color="primary" disabled={loading} type="submit" variant="contained" fullWidth>
                            {loading && <CircularProgress size={25} thickness={2} />}
                            {translate('ra.auth.sign_in')}
                        </Button>
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
