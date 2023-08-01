import { IonCol, IonRow } from '@ionic/react';
import { ReactElement } from 'react';

interface WebLayoutProps {
    leftComponent: ReactElement;
    rightComponent: ReactElement;
}

const WebLayout: React.FC<WebLayoutProps> = ({ leftComponent, rightComponent }) => (
    <IonRow className="no-gutters" style={{ height: '100%' }}>
        <IonCol size="6">{leftComponent}</IonCol>
        <IonCol size="6">{rightComponent}</IonCol>
    </IonRow>
);

export default WebLayout;
