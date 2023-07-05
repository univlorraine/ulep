import { isPlatform } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import CircleAvatar from './CircleAvatar';
import style from './ConnectionContent.module.css';

interface ConnectionContentProps {
    onLoginPressed: () => void;
    onSignUpPressed: () => void;
}

const ConnectionContent: React.FC<ConnectionContentProps> = ({ onLoginPressed, onSignUpPressed }) => {
    const { t } = useTranslation();
    const isHybrid = isPlatform('hybrid');
    return (
        <div
            className={`${style['outer-div']}
            ${isHybrid ? style['hybrid-outer-div-padding'] : style['web-outer-div-padding']}`}
        >
            <div
                className={`${style['connect-div']} ${
                    isHybrid
                        ? `${style['hybrid-div-padding']} ${style['hybrid-connect-div']}`
                        : `${style['web-div-padding']} ${style['web-connect-div']}`
                }`}
            >
                <CircleAvatar
                    backgroundImage="/public/assets/avatar.svg"
                    height={76}
                    viewClassName={style.icons}
                    width={76}
                />
                <p className={style.title}>{t('connection_page.connect_title')}</p>
                <button className="primary-button" onClick={onLoginPressed}>
                    {t('connection_page.connect_button')}
                </button>
            </div>

            <div
                className={`${style['signup-div']}
             ${isHybrid ? style['hybrid-div-padding'] : style['web-div-padding']}`}
            >
                <CircleAvatar
                    backgroundImage="/public/assets/create-account-logo.svg"
                    height={76}
                    viewClassName={style.icons}
                    width={76}
                />
                <p className={style.title}>{t('connection_page.signup_title')}</p>
                <button className="primary-button" onClick={onSignUpPressed}>
                    {t('connection_page.signup_button')}
                </button>
            </div>
        </div>
    );
};

export default ConnectionContent;
