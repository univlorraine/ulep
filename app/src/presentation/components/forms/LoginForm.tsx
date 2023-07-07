import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonLabel,
    IonRouterLink,
    useIonLoading,
    useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import CircleAvatar from '../CircleAvatar';
import style from './Form.module.css';

const LoginForm = () => {
    const { t } = useTranslation();
    const { loginUsecase } = useConfig();
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        const result = await loginUsecase.execute(email, password);
        if (result instanceof Error) {
            await showToast({ message: t(result.message), duration: 5000 });
        } else {
            await showToast({ message: 'Connexion réussi' }); // TODO: change this later
        }
        await hideLoading();
    };

    return (
        <div className="container">
            <IonHeader className="ion-no-border">
                <IonButton fill="clear" onClick={() => history.goBack()}>
                    <img alt="goBack" src="/assets/left-chevron.svg" />
                </IonButton>
            </IonHeader>
            <IonContent>
                <form className={style['main-content']} onSubmit={handleLogin}>
                    <CircleAvatar
                        backgroundImage="./assets/avatar.svg"
                        height={36}
                        viewClassName={style['icons']}
                        width={36}
                    />
                    <div className={`ion-text-center`}>
                        <h1 className={style.title}>{t('login_page.title')}</h1>
                    </div>
                    <div className="ion-text-center">
                        <p className={style.subtitle}>{t('login_page.subtitle')}</p>
                    </div>
                    <IonLabel className="input-label" position="stacked">
                        {t('global.email')}
                    </IonLabel>
                    <IonInput
                        label=""
                        className="text small-margin-top large-margin-bottom"
                        errorText={t('login_page.invalid_email') || ''}
                        name="email"
                        onIonChange={(e) => setEmail((e.detail.value as string) ?? '')}
                        type="email"
                        value={email}
                        required
                    ></IonInput>
                    <IonLabel className="input-label" position="stacked">
                        {t('global.password')}
                    </IonLabel>
                    <IonInput
                        label=""
                        className="text small-margin-top"
                        errorText={t('login_page.invalid_password') || ''}
                        name="password"
                        onIonChange={(e) => setPassword((e.detail.value as string) ?? '')}
                        type="password"
                        value={password}
                        required
                    ></IonInput>
                    <div className={style['bottom-container']}>
                        <button className="primary-button">{t('login_page.button')}</button>

                        <IonRouterLink className={`${style['forgot']} large-margin-top`} routerLink="/forgot-password">
                            {t('login_page.forgot')}
                        </IonRouterLink>
                    </div>
                </form>
            </IonContent>
        </div>
    );
};
export default LoginForm;
