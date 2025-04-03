/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { IonButton, IonHeader, IonRouterLink, useIonLoading } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvatarPng, LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Tokens from '../../../domain/entities/Tokens';
import useLogout from '../../hooks/useLogout';
import CircleAvatar from '../CircleAvatar';
import TextInput from '../TextInput';
import style from './Form.module.css';

interface LoginFormProps {
    goBack: () => void;
    onLogin: (tokens: Tokens) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ goBack, onLogin }) => {
    const { t } = useTranslation();
    const { browserAdapter, deviceAdapter, configuration, getInitialUrlUsecase, login } = useConfig();
    const { handleLogout } = useLogout();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();

    const handleLogin = async () => {
        await showLoading();
        const result = await login.execute(email, password);
        if (result instanceof Error) {
            await hideLoading();
            return setErrorMessage(result.message);
        }
        setErrorMessage('');
        await hideLoading();
        onLogin(result);
    };

    const ssoLogin = async (): Promise<void> => {
        const redirectUri = encodeURIComponent(
            deviceAdapter.isNativePlatform() ? 'ulep://auth' : `${window.location.origin}/auth`
        );

        await browserAdapter.open(getInitialUrlUsecase.execute(redirectUri), '_self');
    };

    return (
        <div className="container content-wrapper">
            <IonHeader className="ion-no-border">
                <IonButton fill="clear" onClick={goBack}>
                    <img alt={t('global.go_back') as string} src={LeftChevronSvg} />
                </IonButton>
            </IonHeader>
            <div
                className={`${style['main-content']} ${deviceAdapter.isNativePlatform() ? style['native-platform'] : ''}`}
            >
                <CircleAvatar backgroundImage={AvatarPng} height={36} viewClassName={style['icons']} width={36} />
                <div className={`ion-text-center`}>
                    <h1 className={style.title}>{t('login_page.title')}</h1>
                </div>
                <div className={style['bottom-container']}>
                    <p className={style['sso-text']}>
                        {t('login_page.sso_title', { name: configuration.mainUniversityName })}
                    </p>
                    <button
                        aria-label={t('login_page.sso_button') as string}
                        className="tertiary-button large-margin-vertical center-button"
                        onClick={ssoLogin}
                    >
                        {t('login_page.sso_button')}
                    </button>
                </div>
                <div className={style.separator} />
                <div className="ion-text-center">
                    <p className={style.subtitle}>{t('login_page.subtitle')}</p>
                </div>
                <TextInput
                    id="input-email"
                    autocomplete="email"
                    onChange={(email) => setEmail(email.trim())}
                    title={t('global.email') as string}
                    type="email"
                    value={email}
                />
                <TextInput
                    id="input-password"
                    autocomplete="current-password"
                    onChange={setPassword}
                    title={t('global.password') as string}
                    type="password"
                    value={password}
                />
                {errorMessage && <p className={style['error-message']}>{t(errorMessage)}</p>}
                <div className={style['bottom-container']}>
                    <IonButton
                        aria-label={t('login_page.button') as string}
                        fill="clear"
                        className="primary-button no-padding"
                        onClick={handleLogin}
                    >
                        {t('login_page.button')}
                    </IonButton>

                    <IonRouterLink className="secondary-button large-margin-top" routerLink="/forgot-password">
                        {t('login_page.forgot')}
                    </IonRouterLink>
                </div>
                {deviceAdapter.isNativePlatform() && (
                    <span className={`${style.subtitle} ${style['update-instance']}`} onClick={() => handleLogout()}>
                        {t('login_page.update_instance')}
                    </span>
                )}
            </div>
        </div>
    );
};
export default LoginForm;
