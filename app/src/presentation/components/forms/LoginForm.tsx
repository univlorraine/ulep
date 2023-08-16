import { IonButton, IonContent, IonHeader, IonRouterLink, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvatarSvg, LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Tokens } from '../../../domain/interfaces/LoginUsecase.interface';
import CircleAvatar from '../CircleAvatar';
import TextInput from '../TextInput';
import style from './Form.module.css';

interface LoginFormProps {
    goBack: () => void;
    onLogin: (tokens: Tokens) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ goBack, onLogin }) => {
    const { t } = useTranslation();
    const { login } = useConfig();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        const result = await login.execute(email, password);
        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 5000 });
        }
        onLogin(result);
        await hideLoading();
    };

    return (
        <div className="container">
            <IonHeader className="ion-no-border">
                <IonButton fill="clear" onClick={goBack}>
                    <img alt="goBack" src={LeftChevronSvg} />
                </IonButton>
            </IonHeader>
            <IonContent>
                <form className={style['main-content']} onSubmit={handleLogin}>
                    <CircleAvatar backgroundImage={AvatarSvg} height={36} viewClassName={style['icons']} width={36} />
                    <div className={`ion-text-center`}>
                        <h1 className={style.title}>{t('login_page.title')}</h1>
                    </div>
                    <div className="ion-text-center">
                        <p className={style.subtitle}>{t('login_page.subtitle')}</p>
                    </div>
                    <TextInput onChange={setEmail} title={t('global.email')} type="email" value={email} />
                    <TextInput onChange={setPassword} title={t('global.password')} type="password" value={password} />
                    <div className={style['bottom-container']}>
                        <button className="primary-button">{t('login_page.button')}</button>

                        <IonRouterLink className="secondary-button large-margin-top" routerLink="/forgot-password">
                            {t('login_page.forgot')}
                        </IonRouterLink>
                    </div>
                </form>
            </IonContent>
        </div>
    );
};
export default LoginForm;
