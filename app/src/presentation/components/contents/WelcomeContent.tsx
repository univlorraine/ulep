/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BackgroundBluePng,
    BackgroundRedPng,
    BackgroundYellowPng,
    BonjourBubbleSvg,
    ChineseBubble,
    HiBubbleSvg,
} from '../../../assets';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { BACKGROUND_HYBRID_STYLE_INLINE, BACKGROUND_WEB_STYLE_INLINE, HYBRID_MAX_WIDTH } from '../../utils';
import style from './WelcomeContent.module.css';

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
    const { t } = useTranslation();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    const onButtonPressed = () => {
        onPress?.();
    };

    useEffect(() => {
        setCurrentTheme(themes[Math.floor(Math.random() * themes.length)]);
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
        <div style={backgroundStyle} className={`content-wrapper container`}>
            <img src={currentTheme.image} alt={t('global.hello') as string} className={style['bubble']} />
            <h1 className={style['welcome-text']}>
                {t('global.welcome')} <br />
                <span className={style['welcome-subtext']}>{t('global.welcome_subtext')}</span>
            </h1>

            <button
                aria-label={t('global.welcome_btn') as string}
                className={style.button}
                disabled={!onPress}
                onClick={onButtonPressed}
            >
                <p className={style['button-text']}>{t('global.welcome_btn')}</p>
            </button>
        </div>
    );
};

export default WelcomeContent;
