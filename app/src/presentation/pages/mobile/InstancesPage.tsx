import { IonPage } from '@ionic/react';
import ULLogo from '../../../assets/instances/ul-logo.svg';
import { useState } from 'react';
import styles from '../css/InstancePage.module.css';

interface Instance {
    apiUrl: string;
    image: string;
    name: string;
}

const instances: Instance[] = [
    {
        image: ULLogo,
        name: 'Université de Lorraine',
        apiUrl: 'http://localhost:3000',
    },
    {
        image: ULLogo,
        name: 'Université de Lorraine',
        apiUrl: '',
    },
];

interface InstancesPageProps {
    onValidate: (url: string) => void;
}

const InstancesPage: React.FC<InstancesPageProps> = ({ onValidate }) => {
    const [selectedInstance, setSelectedInstance] = useState<Instance>();
    return (
        <IonPage>
            <div className={`content-wrapper ${styles.container}`}>
                <h1 className="title">Votre instance</h1>
                <p className="subtitle">Choisis ton instance dans la liste ci-dessous</p>
                {instances.map((instance) => (
                    <button
                        key={instance.apiUrl}
                        className={styles.instance}
                        onClick={() => setSelectedInstance(instance)}
                        style={{
                            backgroundColor: selectedInstance?.apiUrl === instance.apiUrl ? '#FDEE66' : '#F2F4F7',
                        }}
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
                Valider et continuer
            </button>
        </IonPage>
    );
};

export default InstancesPage;
