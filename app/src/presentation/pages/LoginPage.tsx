import {
    IonButton,
    IonContent,
    IonFooter,
    IonInput,
    IonLabel,
    IonList,
    IonPage,
    IonRouterLink,
    useIonLoading,
    useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import CircleAvatar from '../components/CircleAvatar';
import style from './LoginPage.module.css';

const LoginPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();

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
        <IonPage>
            <IonContent>
                <IonButton fill="clear" onClick={() => history.goBack()}>
                    <img alt="goBack" src="/assets/left-chevron.svg" />
                </IonButton>
                <IonList className={style['main-content']} inset={true}>
                    {/* Avatar */}
                    <CircleAvatar
                        backgroundImage="./assets/avatar.svg"
                        height={36}
                        viewClassName={style['icons']}
                        width={36}
                    />
                    {/* Header */}
                    <div className={`ion-text-center`}>
                        <h1 className={style.title}>{t('login_page.title')}</h1>
                    </div>
                    <div className="ion-text-center">
                        <p>{t('login_page.subtitle')}</p>
                    </div>
                    {/* Form */}
                    <div className="ion-padding-top">
                        <form onSubmit={handleLogin}>
                            <IonLabel position="stacked">{t('global.email')}</IonLabel>
                            <IonInput
                                className="text small-margin-top large-margin-bottom"
                                errorText={t('login_page.invalid_email') || ''}
                                name="email"
                                onIonChange={(e) => setEmail((e.detail.value as string) ?? '')}
                                type="email"
                                value={email}
                                required
                            ></IonInput>
                            <IonLabel position="stacked">{t('global.password')}</IonLabel>
                            <IonInput
                                className="text small-margin-top"
                                errorText={t('login_page.invalid_password') || ''}
                                name="password"
                                onIonChange={(e) => setPassword((e.detail.value as string) ?? '')}
                                type="password"
                                value={password}
                                required
                            ></IonInput>
                            <div className={style['bottomContainer']}>
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
            <IonFooter style={{ border: 'none' }}></IonFooter>
        </IonPage>
    );
};

export default LoginPage;
