/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
