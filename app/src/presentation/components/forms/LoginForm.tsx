import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonLabel,
    IonList,
    IonRouterLink,
    isPlatform,
    useIonLoading,
    useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import CircleAvatar from '../CircleAvatar';
import style from './LoginForm.module.css';

const LoginForm = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();
    const isHybrid = isPlatform('hybrid');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        try {
            console.log('test');
            // TODO
            await showToast({ message: 'Hello world' });
        } catch (e: any) {
            await showToast({ message: e.error_description || e.message, duration: 5000 });
        } finally {
            await hideLoading();
        }
    };

    return (
        <div className="container">
            <IonHeader className="ion-no-border">
                <IonButton fill="clear" onClick={() => history.goBack()}>
                    <img alt="goBack" src="/assets/left-chevron.svg" />
                </IonButton>
            </IonHeader>
            <IonContent>
                <IonList
                    className={`${style['main-content']} ${
                        !isPlatform('hybrid') ? style['web-main-content-padding'] : ''
                    }`}
                    inset={true}
                >
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
                    <div className="ion-padding-top">
                        <form onSubmit={handleLogin}>
                            <IonLabel className="input-label" position="stacked">
                                {t('global.email')}
                            </IonLabel>
                            <IonInput
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
                                className="text small-margin-top"
                                errorText={t('login_page.invalid_password') || ''}
                                name="password"
                                onIonChange={(e) => setPassword((e.detail.value as string) ?? '')}
                                type="password"
                                value={password}
                                required
                            ></IonInput>
                            <div
                                className={`${style['bottom-container']} ${
                                    !isHybrid ? style['web-bottom-container-padding'] : ''
                                }`}
                            >
                                <button className="primary-button">{t('login_page.button')}</button>

                                <IonRouterLink
                                    className={`${style['forgot']} large-margin-top`}
                                    routerLink="/autre-page"
                                    style={{ textAlign: 'center' }}
                                >
                                    {t('login_page.forgot')}
                                </IonRouterLink>
                            </div>
                        </form>
                    </div>
                </IonList>
            </IonContent>
        </div>
    );
};
export default LoginForm;
