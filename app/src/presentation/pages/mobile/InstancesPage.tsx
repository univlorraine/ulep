import { IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ULLogo from '../../../assets/instances/ul-logo.svg';
import styles from '../css/InstancePage.module.css';

interface Instance {
    apiUrl: string;
    chatUrl: string;
    image: string;
    name: string;
    socketChatUrl: string;
    jitsiUrl: string;
}

const instances: Instance[] = [
    {
        image: ULLogo,
        name: 'Université de Lorraine et ses partenaires',
        apiUrl: import.meta.env.VITE_UL_API_URL,
        chatUrl: import.meta.env.VITE_UL_CHAT_URL,
        socketChatUrl: import.meta.env.VITE_UL_SOCKET_CHAT_URL,
        jitsiUrl: import.meta.env.VITE_UL_JITSI_URL,
    },
];

if (import.meta.env.VITE_ENV === 'dev') {
    instances.push({
        image: ULLogo,
        name: 'Localhost dev mode',
        apiUrl: import.meta.env.VITE_LOCAL_API,
        chatUrl: import.meta.env.VITE_LOCAL_CHAT_URL,
        socketChatUrl: import.meta.env.VITE_LOCAL_SOCKET_CHAT_URL,
        jitsiUrl: import.meta.env.VITE_LOCAL_JITSI_URL,
    });
}

export interface ValidateInstance {
    apiUrl: string;
    chatUrl: string;
    socketChatUrl: string;
    jitsiUrl: string;
}

interface InstancesPageProps {
    onValidate: ({ apiUrl, chatUrl, socketChatUrl }: ValidateInstance) => void;
}

const InstancesPage: React.FC<InstancesPageProps> = ({ onValidate }) => {
    const { t } = useTranslation();
    const [selectedInstance, setSelectedInstance] = useState<Instance>();

    useEffect(() => {
        if (instances.length === 1) {
            onValidate({
                apiUrl: instances[0].apiUrl,
                chatUrl: instances[0].chatUrl,
                socketChatUrl: instances[0].socketChatUrl,
                jitsiUrl: instances[0].jitsiUrl,
            });
        }
    }, []);

    return (
        <IonPage>
            <div className={`content-wrapper ${styles.container}`}>
                <h1 className="title">{t('instance.title')}</h1>
                <p className="subtitle">{t('instance.subtitle')}</p>
                {instances.map((instance) => (
                    <button
                        key={instance.apiUrl}
                        aria-label={instance.name}
                        className={`${styles.instance} ${
                            selectedInstance?.apiUrl === instance.apiUrl && styles['primary-instance']
                        }`}
                        onClick={() => setSelectedInstance(instance)}
                    >
                        <img alt="" className={styles.image} src={instance.image} aria-hidden={true} />
                        <p className={styles['instance-name']}>{instance.name}</p>
                    </button>
                ))}
            </div>
            <button
                aria-label={t('instance.button') as string}
                className={`primary-button ${styles.button} ${!selectedInstance ? 'disabled' : ''}`}
                disabled={!selectedInstance}
                onClick={() =>
                    onValidate({
                        apiUrl: selectedInstance!.apiUrl,
                        chatUrl: selectedInstance!.chatUrl,
                        socketChatUrl: selectedInstance!.socketChatUrl,
                        jitsiUrl: selectedInstance!.jitsiUrl,
                    })
                }
            >
                {t('instance.button')}
            </button>
        </IonPage>
    );
};

export default InstancesPage;
