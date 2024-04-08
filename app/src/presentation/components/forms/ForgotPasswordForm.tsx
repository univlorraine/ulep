import { IonButton, IonContent, IonHeader, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { AvatarPng, LeftChevronSvg } from '../../../assets';
import CircleAvatar from '../CircleAvatar';
import TextInput from '../TextInput';
import style from './Form.module.css';
import { useConfig } from '../../../context/ConfigurationContext';

const ForgotPasswordForm = () => {
    const { t } = useTranslation();
    const { resetPassword } = useConfig();
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        const result = await resetPassword.execute(email);
        if (result instanceof Error) {
            await showToast({ message: t(result.message), duration: 5000 });
        } else {
            await history.push('/forgot-password/sent', { email });
        }
        await hideLoading();
    };

    return (
        <div className="container">
            <IonHeader className="ion-no-border">
                <IonButton aria-label={t('global.go_back') as string} fill="clear" onClick={() => history.goBack()}>
                    <img alt={t('global.go_back') as string} src={LeftChevronSvg} />
                </IonButton>
            </IonHeader>
            <IonContent>
                <form className={style['main-content']} onSubmit={handleForgotPassword}>
                    <CircleAvatar backgroundImage={AvatarPng} height={36} viewClassName={style['icons']} width={36} />
                    <div className={`ion-text-center`}>
                        <h1 className={style.title}>{t('forgot_password_page.title')}</h1>
                    </div>
                    <TextInput
                        autocomplete="email"
                        onChange={setEmail}
                        title={t('global.email')}
                        value={email}
                        type="email"
                    />
                    <div className={style['bottom-container']}>
                        <button aria-label={t('forgot_password_page.button') as string} className="primary-button">
                            {t('forgot_password_page.button')}
                        </button>
                    </div>
                </form>
            </IonContent>
        </div>
    );
};
export default ForgotPasswordForm;
