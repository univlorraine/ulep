import { IonButton, IonContent, IonHeader, IonRouterLink, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import CircleAvatar from '../CircleAvatar';
import TextInput from '../TextInput';
import style from './Form.module.css';

interface LoginFormProps {
    goBack: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({goBack}) => {
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
                <IonButton fill="clear" onClick={goBack}>
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
