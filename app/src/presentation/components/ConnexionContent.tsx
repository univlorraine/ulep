import { isPlatform } from '@ionic/react';
import CircleAvatar from './CircleAvatar';
import './ConnectionContent.css';

interface ConenxionContentProps {
    onLoginPressed: () => void;
    onSignUpPressed: () => void;
}

const ConnexionContent: React.FC<ConenxionContentProps> = ({ onLoginPressed, onSignUpPressed }) => {
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
                <p className="title">As-tu déjà un compte ?</p>
                <button className="primary-button" onClick={onLoginPressed}>
                    Se connecter
                </button>
            </div>

            <div className={`signup-div ${isHybrid ? 'hybrid-div-padding' : 'web-div-padding'}`}>
                <CircleAvatar
                    backgroundImage="/public/assets/create-account-logo.svg"
                    height={76}
                    viewClassName="icons"
                    width={76}
                />
                <p className="title">Première fois sur l’application ?</p>
                <button className="primary-button" onClick={onSignUpPressed}>
                    Créer un compte
                </button>
            </div>
        </div>
    );
};

export default ConnexionContent;
