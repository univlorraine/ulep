import { IonButton, IonContent, IonHeader, IonRouterLink, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvatarPng, LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import CircleAvatar from '../CircleAvatar';
import TextInput from '../TextInput';
import style from './Form.module.css';
import Tokens from '../../../domain/entities/Tokens';

interface LoginFormProps {
    goBack: () => void;
    onLogin: (tokens: Tokens) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ goBack, onLogin }) => {
    const { t } = useTranslation();
    const { browserAdapter, deviceAdapter, configuration, getInitialUrlUsecase, login } = useConfig();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        const result = await login.execute(email, password);
        if (result instanceof Error) {
            await hideLoading();
            return await showToast({ message: t(result.message), duration: 5000 });
        }
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
        <div className="container">
            <IonHeader className="ion-no-border">
                <IonButton fill="clear" onClick={goBack}>
                    <img alt="goBack" src={LeftChevronSvg} />
                </IonButton>
            </IonHeader>
            <IonContent>
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
                    <form onSubmit={handleLogin}>
                        <div className="ion-text-center">
                            <p className={style.subtitle}>{t('login_page.subtitle')}</p>
                        </div>
                        <TextInput
                            autocomplete="email"
                            onChange={setEmail}
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
                        <div className={style['bottom-container']}>
                            <button
                                aria-label={t('login_page.button') as string}
                                className="primary-button center-button"
                            >
                                {t('login_page.button')}
                            </button>

                            <IonRouterLink className="secondary-button large-margin-top" routerLink="/forgot-password">
                                {t('login_page.forgot')}
                            </IonRouterLink>
                        </div>
                    </form>
                </div>
            </IonContent>
        </div>
    );
};
export default LoginForm;
