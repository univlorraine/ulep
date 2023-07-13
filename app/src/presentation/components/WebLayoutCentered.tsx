import { IonContent, IonPage } from '@ionic/react';
import { ReactElement } from 'react';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import Header from './Header';

interface WebLayoutCenteredProps {
    headerColor: string;
    headerPercentage: number;
    headerTitle: string;
    children: ReactElement;
}

const WebLayoutCentered: React.FC<WebLayoutCenteredProps> = ({
    headerColor,
    headerPercentage,
    headerTitle,
    children,
}) => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    return (
        <IonPage>
            <IonContent className="ion-background-yellow">
                {!isHybrid && (
                    <img alt="background" className="background-image" src="assets/backgrounds/background-yellow.png" />
                )}
                <div className="page content-wrapper">
                    <div className="white-centered-div">
                        <Header progressColor={headerColor} progressPercentage={headerPercentage} title={headerTitle} />
                        {children}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default WebLayoutCentered;
