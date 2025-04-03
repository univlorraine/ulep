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
                        id="input-email"
                        autocomplete="email"
                        onChange={(email) => setEmail(email.trim())}
                        title={t('global.email') as string}
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
