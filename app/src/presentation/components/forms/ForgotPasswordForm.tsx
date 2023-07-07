import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonLabel,
    isPlatform,
    useIonLoading,
    useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import CircleAvatar from '../CircleAvatar';
import style from './Form.module.css';

const ForgotPasswordForm = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();
    const isHybrid = isPlatform('hybrid');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        const result: any = [];
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
                    <div className={style['bottom-container']}>
                        <button className="primary-button">{t('login_page.button')}</button>
                    </div>
                </form>
            </IonContent>
        </div>
    );
};
export default ForgotPasswordForm;
