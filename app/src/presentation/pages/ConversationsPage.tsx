import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const ConversationsPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Chat</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <p>Voici la page de chat.</p>
            </IonContent>
        </IonPage>
    );
};

export default ConversationsPage;
