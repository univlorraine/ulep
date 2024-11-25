import { IonButton, IonHeader, IonRouterLink, useIonLoading } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvatarPng, LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Tokens from '../../../domain/entities/Tokens';
import useLogout from '../../hooks/useLogout';
import CircleAvatar from '../CircleAvatar';
import TextInput from '../TextInput';
import style from './Form.module.css';

interface LoginFormProps {
    goBack: () => void;
    onLogin: (tokens: Tokens) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ goBack, onLogin }) => {
    const { t } = useTranslation();
    const { browserAdapter, deviceAdapter, configuration, getInitialUrlUsecase, login } = useConfig();
    const { handleLogout } = useLogout();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();

    const handleLogin = async () => {
        await showLoading();
        const result = await login.execute(email, password);
        if (result instanceof Error) {
            await hideLoading();
            return setErrorMessage(result.message);
        }
        setErrorMessage('');
        await hideLoading();
        onLogin(result);
    };

    const ssoLogin = async (): Promise<void> => {
        const redirectUri = encodeURIComponent(
            deviceAdapter.isNativePlatform() ? 'ulep://auth' : `${window.location.origin}/auth`
        );

        await browserAdapter.open(getInitialUrlUsecase.execute(redirectUri), '_self');
    };

    return (
        <div className="container content-wrapper">
            <IonHeader className="ion-no-border">
                <IonButton fill="clear" onClick={goBack}>
                    <img alt={t('global.go_back') as string} src={LeftChevronSvg} />
                </IonButton>
            </IonHeader>
            <div className={style['main-content']}>
                <CircleAvatar backgroundImage={AvatarPng} height={36} viewClassName={style['icons']} width={36} />
                <div className={`ion-text-center`}>
                    <h1 className={style.title}>{t('login_page.title')}</h1>
                </div>
                <div className={style['bottom-container']}>
                    <p className={style['sso-text']}>
                        {t('login_page.sso_title', { name: configuration.mainUniversityName })}
                    </p>
                    <button
                        aria-label={t('login_page.sso_button') as string}
                        className="tertiary-button large-margin-vertical center-button"
                        onClick={ssoLogin}
                    >
                        {t('login_page.sso_button')}
                    </button>
                </div>
                <div className={style.separator} />
                <div className="ion-text-center">
                    <p className={style.subtitle}>{t('login_page.subtitle')}</p>
                </div>
                <TextInput
                    autocomplete="email"
                    onChange={(email) => setEmail(email.trim())}
                    title={t('global.email')}
                    type="email"
                    value={email}
                />
                <TextInput
                    autocomplete="current-password"
                    onChange={setPassword}
                    title={t('global.password')}
                    type="password"
                    value={password}
                />
                {errorMessage && <p className={style['error-message']}>{t(errorMessage)}</p>}
                <div className={style['bottom-container']}>
                    <IonButton
                        aria-label={t('login_page.button') as string}
                        fill="clear"
                        className="primary-button no-padding"
                        onClick={handleLogin}
                    >
                        {t('login_page.button')}
                    </IonButton>

                    <IonRouterLink className="secondary-button large-margin-top" routerLink="/forgot-password">
                        {t('login_page.forgot')}
                    </IonRouterLink>
                </div>
                {deviceAdapter.isNativePlatform() && (
                    <span className={`${style.subtitle} ${style['update-instance']}`} onClick={() => handleLogout()}>
                        {t('login_page.update_instance')}
                    </span>
                )}
            </div>
        </div>
    );
};
export default LoginForm;
