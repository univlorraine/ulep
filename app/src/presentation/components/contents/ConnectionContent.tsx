import { useTranslation } from 'react-i18next';
import { AvatarPng, CreateAccountPng } from '../../../assets';
import CircleAvatar from '../CircleAvatar';
import style from './ConnectionContent.module.css';

interface ConnectionContentProps {
    onLoginPressed: () => void;
    onSignUpPressed: () => void;
}

const ConnectionContent: React.FC<ConnectionContentProps> = ({ onLoginPressed, onSignUpPressed }) => {
    const { t } = useTranslation();
    return (
        <div className={style['outer-div']}>
            <div className={style['connect-div']}>
                <CircleAvatar
                    alt="avatar"
                    backgroundImage={AvatarPng}
                    height={76}
                    viewClassName={style.icons}
                    width={76}
                />
                <p className={style.title}>{t('connection_page.connect_title')}</p>
                <button className="primary-button" onClick={onLoginPressed}>
                    {t('connection_page.connect_button')}
                </button>
            </div>

            <div className={style['signup-div']}>
                <CircleAvatar
                    alt="create-account"
                    backgroundImage={CreateAccountPng}
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
