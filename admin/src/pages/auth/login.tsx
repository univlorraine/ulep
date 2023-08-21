import { Card, CardContent, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslate, useLogin, useNotify, Notification } from 'react-admin';

const useStyles = makeStyles(() => ({
    button: {
        width: '100%',
        marginTop: '1em',
    },
    card: {
        minWidth: 300,
        marginTop: '6em',
    },
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        marginTop: '1em',
    },
    main: {
        alignItems: 'center',
        background: 'linear-gradient(to bottom, blue, white)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
    },
}));

const LoginPage = () => {
    const classes = useStyles();
    const translate = useTranslate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const login = useLogin();
    const notify = useNotify();

    const submit = (e: any) => {
        e.preventDefault();
        login({ email, password }).catch(() => notify(translate('login.loginError')));
    };

    return (
        <div className={classes.main}>
            <Card className={classes.card}>
                <CardContent>
                    <form className={classes.form} onSubmit={submit}>
                        <p>{translate('global.email')}</p>
                        <TextField
                            className={classes.input}
                            id="email"
                            name="email"
                            onChange={(e: any) => setEmail(e.target.value)}
                            type="email"
                            value={email}
                            autoFocus
                            fullWidth
                            required
                        />
                        <p>{translate('login.password')}</p>
                        <TextField
                            className={classes.input}
                            id="password"
                            name={translate('login.password')}
                            onChange={(e: any) => setPassword(e.target.value)}
                            type="password"
                            value={password}
                            fullWidth
                            required
                        />
                        <Button className={classes.button} color="primary" type="submit" variant="contained" fullWidth>
                            {translate('login.connect')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Notification />
        </div>
    );
};

export default LoginPage;
