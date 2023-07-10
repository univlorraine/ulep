import { IonPage, IonRouterLink } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import CircleAvatar from '../components/CircleAvatar';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { BACKGROUND_HYBRID_STYLE_INLINE, BACKGROUND_WEB_STYLE_INLINE, HYBRID_MAX_WIDTH } from '../utils';
import style from './css/ForgotPasswordSentPage.module.css';

const ForgotPasswordSentPage: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const backgroundStyle = isHybrid
        ? {
              backgroundImage: `url('/assets/backgrounds/background-yellow.png')`,
              ...BACKGROUND_HYBRID_STYLE_INLINE,
          }
        : {
              backgroundImage: `url('/assets/backgrounds/background-yellow.png')`,
              ...BACKGROUND_WEB_STYLE_INLINE,
          };
    return (
        <IonPage>
            <div className={style['web-content']}>
                <div className={style['main-content']} style={backgroundStyle}>
                    <h1 className={`${style.text} ${style.title}`}>{t('forgot_password_sent_page.title')}</h1>
                    <p className={`${style.text} ${style.subtitle}`}>{t('forgot_password_sent_page.subtitle')}</p>
                    <CircleAvatar
                        alt="mailbox"
                        backgroundImage="./assets/mailbox.svg"
                        height={150}
                        viewClassName={style.icon}
                        width={150}
                    />
                    <div className={style.button}>
                        <button className="primary-button" onClick={() => history.push('/reset-password')}>
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
                </div>
            </div>
        </IonPage>
    );
};

export default ForgotPasswordSentPage;
