import { IonButton, IonContent, IonHeader, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import { isPasswordCorrect } from '../../utils';
import CircleAvatar from '../CircleAvatar';
import TextInput from '../TextInput';
import style from './Form.module.css';

interface ResetPasswordFormProps {
    id: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ id }) => {
    const { t } = useTranslation();
    const { resetPasswordUsecase } = useConfig();
    const history = useHistory();
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordError, setNewPasswordError] = useState<string | null>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        if (!isPasswordCorrect(newPassword)) {
            await hideLoading();
            return setNewPasswordError(t('reset_password_page.new_password_error'));
        }

        if (newPassword !== passwordConfirm) {
            await hideLoading();
            return setPasswordConfirmError(t('reset_password_page.confirm_password_error'));
        }
        const result = await resetPasswordUsecase.execute(id, newPassword);
        if (result instanceof Error) {
            await showToast({ message: t(result.message), duration: 5000 });
        } else {
            history.push('/login');
        }
        await hideLoading();
    };

    const onConfirmPasswordChanged = (text: string) => {
        if (passwordConfirmError) {
            setPasswordConfirmError('');
        }
        setPasswordConfirm(text);
    };

    const onPasswordChanged = (text: string) => {
        if (newPasswordError) {
            setNewPasswordError('');
        }
        setNewPassword(text);
    };

    return (
        <div className="container">
            <IonHeader className="ion-no-border">
                <IonButton fill="clear" onClick={() => history.goBack()}>
                    <img alt="goBack" src="/assets/left-chevron.svg" />
                </IonButton>
            </IonHeader>
            <IonContent>
                <form className={style['main-content']} onSubmit={handleResetPassword}>
                    <CircleAvatar
                        backgroundImage="./assets/avatar.svg"
                        height={36}
                        viewClassName={style['icons']}
                        width={36}
                    />
                    <div className={`ion-text-center`}>
                        <h1 className={style.title}>{t('reset_password_page.title')}</h1>
                    </div>

                    <div className={style['form-container']}>
                        <TextInput
                            errorMessage={newPasswordError}
                            onChange={onPasswordChanged}
                            title={t('reset_password_page.new_password_title')}
                            type="password"
                            value={newPassword}
                        />

                        <TextInput
                            errorMessage={passwordConfirmError}
                            onChange={onConfirmPasswordChanged}
                            title={t('reset_password_page.confirm_password_title')}
                            type="password"
                            value={passwordConfirm}
                        />
                    </div>

                    <div className={style['bottom-container']}>
                        <button className="primary-button">{t('reset_password_page.button')}</button>
                    </div>
                </form>
            </IonContent>
        </div>
    );
};
export default ResetPasswordForm;
