import { IonContent } from '@ionic/react';
import style from './WelcomeContent.module.css';

interface HomeTheme {
    color: string;
    fontSize: string;
    image: string;
}

const themes: HomeTheme[] = [
    { color: '#FDEE66', fontSize: '28px', image: 'bonjour-bubble' },
    { color: '#B4C2DE', fontSize: '60px', image: 'hi-bubble' },
    { color: '#E0897C', fontSize: '50px', image: 'china-bubble' },
];

interface WelcomeContentProps {
    onPress?: () => void;
}

const WelcomeContent: React.FC<WelcomeContentProps> = ({ onPress }) => {
    const currentTheme = themes[Math.floor(Math.random() * themes.length)];
    //TODO: Add mising logo on the top
    return (
        <IonContent>
            <div style={{ backgroundColor: currentTheme.color }} className="container">
                <img src={`./assets/${currentTheme.image}.svg`} alt="bubble" className={style.bubble} />
                <p className={style['welcome-text']}>
                    Bienvenue sur (e)Tandem,
                    <p className={style['welcome-subtext']}>le meilleur moyen de pratiquer une langue</p>
                </p>

                <button className={style.button} disabled={!onPress} onClick={onPress}>
                    <p className={style['button-text']}>Apprends une nouvelle langue en tandem</p>
                </button>
            </div>
        </IonContent>
    );
};

export default WelcomeContent;
