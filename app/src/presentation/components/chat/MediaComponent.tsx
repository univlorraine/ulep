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

import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { documentOutline, musicalNoteOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { DownloadSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import MessageReport from '../../../domain/entities/MessageReport';
import AudioLine from '../AudioLine';
import OGCard from '../card/OGCard';
import styles from './MediaComponent.module.css';

interface MessageProps<T extends Message | MessageReport> {
    message: T;
    setImageToDisplay?: (image: string) => void;
}

const MediaComponent = <T extends Message | MessageReport>({ message, setImageToDisplay }: MessageProps<T>) => {
    const renderMessageContent = () => {
        switch (message.type) {
            case MessageType.Image:
                return <MessageImage message={message} setImageToDisplay={setImageToDisplay} />;
            case MessageType.File:
                return <MessageFile message={message} />;
            case MessageType.Audio:
                return <MessageAudio message={message} />;
            case MessageType.Link:
                return <MessageLinkMedia message={message} />;
            default:
                return null;
        }
    };

    return (
        <div
            role="list"
            className={`${message.type === MessageType.Image ? styles.imageMessageContainer : styles.messageContainer}`}
        >
            {renderMessageContent()}
        </div>
    );
};

const MessageImage: React.FC<MessageProps<Message | MessageReport>> = ({ message, setImageToDisplay }) => {
    const { t } = useTranslation();

    const showModal = () => {
        if (setImageToDisplay) {
            setImageToDisplay(message.content);
        }
    };
    return (
        <IonButton className={styles['image-button']} fill="clear" onClick={showModal}>
            <img className={styles.image} src={message.getThumbnail()} alt={t('chat.medias.images-alt') as string} />
        </IonButton>
    );
};

const MessageAudio: React.FC<MessageProps<Message | MessageReport>> = ({ message }) => {
    return (
        <div className={styles.messageAudio}>
            <IonIcon icon={musicalNoteOutline} size="large" />
            <AudioLine audioFile={message.content} />
        </div>
    );
};

const MessageFile: React.FC<MessageProps<Message | MessageReport>> = ({ message }) => {
    const { fileAdapter } = useConfig();
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const fileName = decodeURI(message.metadata?.originalFilename);

    const handleDownload = async () => {
        await fileAdapter.saveFile(message.content, fileName);
        showToast({
            message: t('chat.fileDownloaded'),
            duration: 2000,
        });
    };

    return (
        <div className={styles.messageFile} role="listitem">
            <IonButton fill="clear" className={styles.downloadButton} onClick={handleDownload}>
                <div className={styles.downloadContainer}>
                    <div className={styles.downloadIconContainer}>
                        <IonIcon icon={documentOutline} size="large" />
                        <span className={styles.downloadTitle}>{fileName}</span>
                    </div>
                    <IonIcon
                        className={styles.download}
                        icon={DownloadSvg}
                        aria-label={t('gloabl.download') as string}
                    />
                </div>
            </IonButton>
        </div>
    );
};

const MessageLinkMedia: React.FC<MessageProps<Message | MessageReport>> = ({ message }) => {
    return (
        <div className={styles.messageLink} role="listitem">
            <OGCard
                imageUrl={message.metadata?.openGraphResult?.ogImage?.[0]?.url}
                title={message.metadata?.openGraphResult?.ogTitle || message.content}
                description={message.metadata?.openGraphResult?.ogDescription || ''}
                url={message.content}
                maxWidth={200}
            />
        </div>
    );
};

export default MediaComponent;
