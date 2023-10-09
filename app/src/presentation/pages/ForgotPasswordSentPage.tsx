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
                    <button className="primary-button" onClick={() => sendEmail()}>
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
