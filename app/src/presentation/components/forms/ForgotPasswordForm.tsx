import { IonButton, IonContent, IonHeader, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import CircleAvatar from '../CircleAvatar';
import TextInput from '../TextInput';
import style from './Form.module.css';

const ForgotPasswordForm = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        const result: any = []; // TODO: call forgot password route
        if (result instanceof Error) {
            await showToast({ message: t(result.message), duration: 5000 });
        } else {
            await history.push('/forgot-password/sent');
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
                <form className={style['main-content']} onSubmit={handleForgotPassword}>
                    <CircleAvatar
                        backgroundImage="./assets/avatar.svg"
                        height={36}
                        viewClassName={style['icons']}
                        width={36}
                    />
                    <div className={`ion-text-center`}>
                        <h1 className={style.title}>{t('forgot_password_page.title')}</h1>
                    </div>
                    <TextInput onChange={setEmail} title={t('global.email')} value={email} type="email" />
                    <div className={style['bottom-container']}>
                        <button className="primary-button">{t('forgot_password_page.button')}</button>
                    </div>
                </form>
            </IonContent>
        </div>
    );
};
export default ForgotPasswordForm;
