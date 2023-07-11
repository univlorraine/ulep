import { IonContent, IonPage } from '@ionic/react';
import { ReactElement } from 'react';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

interface WebLayoutCenteredProps {
    children: ReactElement;
}

const WebLayoutCentered: React.FC<WebLayoutCenteredProps> = ({ children }) => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    return (
        <IonPage>
            <IonContent className="ion-background-yellow">
                {!isHybrid && (
                    <img
                        alt="background"
                        className="background-image"
                        src="public/assets/backgrounds/background-yellow.png"
                    />
                )}
                <div className="page">{children}</div>
            </IonContent>
        </IonPage>
    );
};

export default WebLayoutCentered;
