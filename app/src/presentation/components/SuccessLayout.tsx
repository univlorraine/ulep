import { IonPage } from '@ionic/react';
import { ReactElement } from 'react';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { BACKGROUND_HYBRID_STYLE_INLINE, BACKGROUND_WEB_STYLE_INLINE, HYBRID_MAX_WIDTH } from '../utils';
import styles from './SuccessLayout.module.css';

interface SuccessLayoutProps {
    backgroundColorCode: string;
    children: ReactElement;
    color: string;
    colorCode: string;
}

const SuccessLayout: React.FC<SuccessLayoutProps> = ({ backgroundColorCode, children, color, colorCode }) => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const backgroundStyle = isHybrid
        ? {
              backgroundImage: `url('/assets/backgrounds/background-${color}.png')`,
              backgroundColor: colorCode,
              ...BACKGROUND_HYBRID_STYLE_INLINE,
          }
        : {
              backgroundImage: `url('/assets/backgrounds/background-${color}.png')`,
              backgroundColor: colorCode,
              ...BACKGROUND_WEB_STYLE_INLINE,
          };
    return (
        <IonPage>
            <div className={styles['web-content']} style={{ backgroundColor: backgroundColorCode }}>
                <div className={styles['main-content']} style={backgroundStyle}>
                    {children}
                </div>
            </div>
        </IonPage>
    );
};

export default SuccessLayout;
