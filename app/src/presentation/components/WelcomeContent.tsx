import { IonContent } from '@ionic/react';

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

const WelcomeContent = () => {
    const currentTheme = themes[Math.floor(Math.random() * themes.length)];
    //TODO: Add mising logo on the top
    return (
        <IonContent>
            <div style={{ backgroundColor: currentTheme.color }} className="content-wrapper container">
                <img src={`./assets/${currentTheme.image}.svg`} alt="bubble" className="bubble" />
                <p className="welcome-text">
                    Bienvenue sur (e)Tandem,
                    <p className="welcome-subtext">le meilleur moyen de pratiquer une langue</p>
                </p>

                <div className="button">
                    <p className="button-text">Apprends une nouvelle langue en tandem</p>
                </div>
            </div>
        </IonContent>
    );
};

export default WelcomeContent;
