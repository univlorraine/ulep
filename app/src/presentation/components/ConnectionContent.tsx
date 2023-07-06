import { isPlatform } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import CircleAvatar from './CircleAvatar';
import './ConnectionContent.css';

interface ConnectionContentProps {
    onLoginPressed: () => void;
    onSignUpPressed: () => void;
}

const ConnectionContent: React.FC<ConnectionContentProps> = ({ onLoginPressed, onSignUpPressed }) => {
    const { t } = useTranslation();
    const isHybrid = isPlatform('hybrid');
    return (
        <div className={`outer-div ${isHybrid ? 'hybrid-outer-div-padding' : 'web-outer-div-padding '}`}>
            <div
                className={`connect-div ${
                    isHybrid ? 'hybrid-div-padding hybrid-connect-div' : 'web-div-padding web-connect-div'
                }`}
            >
                <CircleAvatar
                    backgroundImage="/public/assets/avatar.svg"
                    height={76}
                    viewClassName="icons"
                    width={76}
                />
                <p className="title">{t('connection_page.connect_title')}</p>
                <button className="primary-button" onClick={onLoginPressed}>
                    {t('connection_page.connect_button')}
                </button>
            </div>

            <div className={`signup-div ${isHybrid ? 'hybrid-div-padding' : 'web-div-padding'}`}>
                <CircleAvatar
                    backgroundImage="/public/assets/create-account-logo.svg"
                    height={76}
                    viewClassName="icons"
                    width={76}
                />
                <p className="title">{t('connection_page.signup_title')}</p>
                <button className="primary-button" onClick={onSignUpPressed}>
                    {t('connection_page.signup_button')}
                </button>
            </div>
        </div>
    );
};

export default ConnectionContent;
