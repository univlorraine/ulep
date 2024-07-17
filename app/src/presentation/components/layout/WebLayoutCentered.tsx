import { IonContent, IonPage } from '@ionic/react';
import { ReactElement } from 'react';
import { ReactComponent as Background } from '../../../assets/background.svg';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import styles from '../../pages/css/SignUp.module.css';
import { HYBRID_MAX_WIDTH } from '../../utils';
import Header from '../Header';

interface WebLayoutCenteredProps {
    backgroundIconColor: string;
    goBackPressed?: () => void;
    headerColor: string;
    headerPercentage: number;
    headerTitle: string;
    hasGoBackButton?: boolean;
    children: ReactElement;
}

const WebLayoutCentered: React.FC<WebLayoutCenteredProps> = ({
    backgroundIconColor,
    goBackPressed,
    headerColor,
    headerPercentage,
    headerTitle,
    hasGoBackButton = true,
    children,
}) => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    return (
        <IonPage>
            {!isHybrid && (
                <div className="background-image-container">
                    <Background style={{ color: backgroundIconColor }} className="background-image" />
                </div>
            )}
            <div style={{ backgroundColor: isHybrid ? 'white' : headerColor }} className="page content-wrapper">
                <div className="white-centered-div">
                    <Header
                        hasGoBackButton={hasGoBackButton}
                        goBackPressed={goBackPressed}
                        progressColor={headerColor}
                        progressPercentage={headerPercentage}
                        title={headerTitle}
                    />
                    <IonContent className={styles.body}>{children}</IonContent>
                </div>
            </div>
        </IonPage>
    );
};

export default WebLayoutCentered;
