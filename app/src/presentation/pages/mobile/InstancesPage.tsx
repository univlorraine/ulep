import { IonPage } from '@ionic/react';
import ULLogo from '../../../assets/instances/ul-logo.svg';
import { useState } from 'react';
import styles from '../css/InstancePage.module.css';
import { AvatarPng } from '../../../assets';
import { useTranslation } from 'react-i18next';

interface Instance {
    apiUrl: string;
    image: string;
    name: string;
}

const instances: Instance[] = [
    {
        image: ULLogo,
        name: 'Université de Lorraine et ses partenaires',
        apiUrl: import.meta.env.VITE_UL_API_URL,
    },
];

if (import.meta.env.VITE_ENV === 'dev') {
    instances.push({
        image: ULLogo,
        name: 'Localhost dev mode',
        apiUrl: import.meta.env.VITE_LOCAL_API,
    });
}

interface InstancesPageProps {
    onValidate: (url: string) => void;
}

const InstancesPage: React.FC<InstancesPageProps> = ({ onValidate }) => {
    const { t } = useTranslation();
    const [selectedInstance, setSelectedInstance] = useState<Instance>();

    return (
        <IonPage>
            <div className={`content-wrapper ${styles.container}`}>
                <h1 className="title">{t('instance.title')}</h1>
                <p className="subtitle">{t('instance.subtitle')}</p>
                {instances.map((instance) => (
                    <button
                        key={instance.apiUrl}
                        className={`${styles.instance} ${
                            selectedInstance?.apiUrl === instance.apiUrl && styles['primary-instance']
                        }`}
                        onClick={() => setSelectedInstance(instance)}
                    >
                        <img className={styles.image} src={instance.image} />
                        <p className={styles['instance-name']}>{instance.name}</p>
                    </button>
                ))}
            </div>
            <button
                className={`primary-button ${styles.button} ${!selectedInstance ? 'disabled' : ''}`}
                disabled={!selectedInstance}
                onClick={() => onValidate(selectedInstance!.apiUrl)}
            >
                {t('instance.button')}
            </button>
        </IonPage>
    );
};

export default InstancesPage;
