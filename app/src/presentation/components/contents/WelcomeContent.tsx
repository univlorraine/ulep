import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { BACKGROUND_HYBRID_STYLE_INLINE, BACKGROUND_WEB_STYLE_INLINE, HYBRID_MAX_WIDTH } from '../../utils';
import style from './WelcomeContent.module.css';
import {
    BackgroundBluePng,
    BackgroundRedPng,
    BackgroundYellowPng,
    BonjourBubbleSvg,
    ChineseBubble,
    HiBubbleSvg,
} from '../../../assets';

interface HomeTheme {
    background: string;
    color: string;
    fontSize: string;
    image: string;
}

const themes: HomeTheme[] = [
    { background: BackgroundYellowPng, color: '#FDEE66', fontSize: '28px', image: BonjourBubbleSvg },
    { background: BackgroundBluePng, color: '#B4C2DE', fontSize: '60px', image: HiBubbleSvg },
    { background: BackgroundRedPng, color: '#E0897C', fontSize: '50px', image: ChineseBubble },
];

interface WelcomeContentProps {
    onPress?: () => void;
}

const WelcomeContent: React.FC<WelcomeContentProps> = ({ onPress }) => {
    const [currentTheme, setCurrentTheme] = useState<HomeTheme>(themes[0]);
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    useEffect(() => {
        let timeout;
        setCurrentTheme(themes[Math.floor(Math.random() * themes.length)]);
        if (onPress) {
            timeout = setTimeout(() => onPress(), 5000);
        }
        return clearInterval(timeout);
    }, []);

    const backgroundStyle = isHybrid
        ? {
              backgroundImage: `url('${currentTheme.background}')`,
              backgroundColor: currentTheme.color,
              ...BACKGROUND_HYBRID_STYLE_INLINE,
          }
        : {
              backgroundImage: `url('${currentTheme.background}')`,
              backgroundColor: currentTheme.color,
              ...BACKGROUND_WEB_STYLE_INLINE,
          };
    //TODO: Add mising logo on the top
    return (
        <IonContent>
            <div style={backgroundStyle} className={`content-wrapper container`}>
                <img src={currentTheme.image} alt="bubble" className={style['bubble']} />
                <span className={style['welcome-text']}>
                    Bienvenue sur (e)Tandem,
                    <p className={style['welcome-subtext']}>le meilleur moyen de pratiquer une langue</p>
                </span>

                <button className={style.button} disabled={!onPress} onClick={onPress}>
                    <p className={style['button-text']}>Apprends une nouvelle langue en tandem</p>
                </button>
            </div>
        </IonContent>
    );
};

export default WelcomeContent;
