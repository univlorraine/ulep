import { IonButton, IonContent, IonHeader, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { AvatarPng, LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { isEmailCorrect } from '../../utils';
import CircleAvatar from '../CircleAvatar';
import TextInput from '../TextInput';
import style from './Form.module.css';

const ForgotPasswordForm = () => {
    const { t } = useTranslation();
    const { resetPassword } = useConfig();
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [showToast] = useIonToast();

    const handleForgotPassword = async () => {
        if (!isEmailCorrect(email)) {
            return setErrorMessage(t('forgot_password_page.invalid_email') as string);
        }
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
                <div className={style['main-content']}>
                    <CircleAvatar backgroundImage={AvatarPng} height={36} viewClassName={style['icons']} width={36} />
                    <div className={`ion-text-center`}>
                        <h1 className={style.title}>{t('forgot_password_page.title')}</h1>
                    </div>
                    <TextInput
                        autocomplete="email"
                        onChange={setEmail}
                        title={t('global.email')}
                        value={email}
                        errorMessage={errorMessage}
                    />
                    <div className={style['bottom-container']}>
                        <IonButton
                            fill="clear"
                            aria-label={t('forgot_password_page.button') as string}
                            className="primary-button no-padding"
                            onClick={() => handleForgotPassword()}
                        >
                            {t('forgot_password_page.button')}
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </div>
    );
};
export default ForgotPasswordForm;
