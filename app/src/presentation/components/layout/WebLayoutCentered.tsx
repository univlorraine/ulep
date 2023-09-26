import { IonContent, IonPage } from '@ionic/react';
import { ReactElement } from 'react';
import { ReactComponent as Background } from '../../../assets/background.svg';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import Header from '../Header';

interface WebLayoutCenteredProps {
    backgroundIconColor: string;
    goBackPressed?: () => void;
    headerColor: string;
    headerPercentage: number;
    headerTitle: string;
    children: ReactElement;
}

const WebLayoutCentered: React.FC<WebLayoutCenteredProps> = ({
    backgroundIconColor,
    goBackPressed,
    headerColor,
    headerPercentage,
    headerTitle,
    children,
}) => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    return (
        <IonPage>
            <IonContent>
                {!isHybrid && (
                    <div className="background-image-container">
                        <Background style={{ color: backgroundIconColor }} className="background-image" />
                    </div>
                )}
                <div style={{ backgroundColor: headerColor }} className="page content-wrapper">
                    <div className="white-centered-div">
                        <Header goBackPressed={goBackPressed} progressColor={headerColor} progressPercentage={headerPercentage} title={headerTitle} />
                        {children}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default WebLayoutCentered;
