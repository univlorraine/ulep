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

import { IonRouterLink, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import CircleAvatar from '../components/CircleAvatar';
import SuccessLayout from '../components/layout/SuccessLayout';
import style from './css/ForgotPasswordSent.module.css';
import { MailBoxPng } from '../../assets';
import { useLocation } from 'react-router';

interface ForgotPasswordSentPageState {
    email: string;
}

const ForgotPasswordSentPage: React.FC = () => {
    const [showToast] = useIonToast();
    const { configuration, resetPassword } = useConfig();
    const location = useLocation<ForgotPasswordSentPageState>();
    const { email } = location.state || {};
    const { t } = useTranslation();

    const sendEmail = async () => {
        const result = await resetPassword.execute(email);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 5000 });
        }
    };
    return (
        <SuccessLayout
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            backgroundColorCode={configuration.primaryDarkColor}
            colorCode={configuration.primaryColor}
        >
            <>
                <h1 className={`${style.text} ${style.title}`}>{t('forgot_password_sent_page.title')}</h1>
                <p className={`${style.text} ${style.subtitle}`}>{t('forgot_password_sent_page.subtitle')}</p>
                <CircleAvatar
                    alt="mailbox"
                    backgroundImage={MailBoxPng}
                    height={150}
                    viewClassName={style.icon}
                    width={150}
                />
                <div className={style.button}>
                    <button
                        aria-label={t('forgot_password_sent_page.button') as string}
                        className="primary-button"
                        onClick={() => sendEmail()}
                    >
                        {t('forgot_password_sent_page.button')}
                    </button>
                </div>
                <IonRouterLink className={`secondary-button large-margin-top`} routerLink="/login">
                    {t('forgot_password_sent_page.forgot')}
                </IonRouterLink>
                <p
                    className={`${style.text} ${style.footer}`}
                    dangerouslySetInnerHTML={{
                        __html:
                            t('forgot_password_sent_page.footer_first_line') +
                            '<br />' +
                            t('forgot_password_sent_page.footer_second_line'),
                    }}
                />
            </>
        </SuccessLayout>
    );
};

export default ForgotPasswordSentPage;
