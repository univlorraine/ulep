import { IonContent, isPlatform } from '@ionic/react';
import style from './WelcomeContent.module.css';

interface HomeTheme {
    background: string;
    color: string;
    fontSize: string;
    image: string;
}

const themes: HomeTheme[] = [
    {
        background: '/assets/backgrounds/background-yellow.png',
        color: '#FDEE66',
        fontSize: '28px',
        image: 'bonjour-bubble',
    },
    { background: '/assets/backgrounds/background-blue.png', color: '#B4C2DE', fontSize: '60px', image: 'hi-bubble' },
    { background: '/assets/backgrounds/background-red.png', color: '#E0897C', fontSize: '50px', image: 'china-bubble' },
];

interface WelcomeContentProps {
    onPress?: () => void;
}

const WelcomeContent: React.FC<WelcomeContentProps> = ({ onPress }) => {
    const currentTheme = themes[Math.floor(Math.random() * themes.length)];
    const backgroundStyle = {
        backgroundColor: currentTheme.color,
        backgroundImage: `url('${currentTheme.background}')`,
        backgroundPosition: isPlatform('hybrid') ? '-100px top' : 'right top', // Negative position for "outside box" effect
        backgroundRepeat: 'no-repeat',
        backgroundSize: isPlatform('hybrid') ? '150%' : '100%', // Increase size on mobile for "outside box" effect
    };
    //TODO: Add mising logo on the top
    return (
        <IonContent>
            <div style={backgroundStyle} className={`content-wrapper container`}>
                <img
                    src={`./assets/${currentTheme.image}.svg`}
                    alt="bubble"
                    className={`${isPlatform('hybrid') ? style['hybrid-bubble'] : style['web-bubble']}`}
                />
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
