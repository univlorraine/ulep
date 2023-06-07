import { useState } from 'react';
import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    useIonToast,
    useIonLoading,
    IonHeader,
    IonToolbar,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import CircleAvatar from '../components/CircleAvatar';

export function LoginPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        try {
            // TODO
            await showToast({ message: 'Hello world' });
        } catch (e: any) {
            await showToast({ message: e.error_description || e.message, duration: 5000 });
        } finally {
            await hideLoading();
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar />
            </IonHeader>
            <IonContent>
                <IonList inset={true}>
                    {/* Avatar */}
                    <CircleAvatar backgroundImage="./assets/avatar.svg" />
                    {/* Header */}
                    <div className="ion-text-center">
                        <h1>{t('login_page.title')}</h1>
                    </div>
                    <div className="ion-text-center">
                        <p>{t('login_page.subtitle')}</p>
                    </div>
                    {/* Form */}
                    <div className="ion-padding-top">
                        <form onSubmit={handleLogin}>
                            <IonItem>
                                <IonLabel position="stacked">{t('global.email')}</IonLabel>
                                <IonInput
                                    value={email}
                                    name="email"
                                    onIonChange={(e) => setEmail(e.detail.value ?? '')}
                                    type="email"
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">{t('global.password')}</IonLabel>
                                <IonInput
                                    value={password}
                                    name="password"
                                    onIonChange={(e) => setPassword(e.detail.value ?? '')}
                                    type="password"
                                    required
                                ></IonInput>
                            </IonItem>
                            <div className="ion-text-center ion-padding-top">
                                <IonButton type="submit">{t('login_page.button')}</IonButton>
                            </div>
                        </form>
                    </div>
                </IonList>
            </IonContent>
        </IonPage>
    );
}
