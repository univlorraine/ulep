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

import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LeftChevronSvg } from '../../../assets';
import Conversation from '../../../domain/entities/chat/Conversation';
import { MessageType } from '../../../domain/entities/chat/Message';
import Profile from '../../../domain/entities/Profile';
import useHandleMessagesFromConversation from '../../hooks/useHandleMessagesFromConversation';
import MediasList from '../chat/MediasList';
import Loader from '../Loader';
import styles from './MediaContent.module.css';

interface MediaContentProps {
    conversation: Conversation;
    goBack?: () => void;
    isHybrid: boolean;
    profile: Profile;
    setImageToDisplay: (image: string) => void;
}

const Content: React.FC<Omit<MediaContentProps, 'isHybrid'>> = ({
    conversation,
    goBack,
    setImageToDisplay,
    profile,
}) => {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState<MessageType>(MessageType.Image);
    const { messages, isScrollForwardOver, isLoading, onLoadMessages } = useHandleMessagesFromConversation({
        conversationId: conversation.id,
        typeFilter: selectedFilter,
        limit: 30,
    });
    const partner = Conversation.getMainConversationPartner(conversation, profile.id);

    return (
        <div className={`${styles.container} content-wrapper`}>
            <div className={styles.header}>
                <div className={styles['header-title']}>
                    {goBack && (
                        <IonButton
                            fill="clear"
                            onClick={goBack}
                            aria-label={
                                t('chat.conversation_menu.return_to_chat_aria_label', {
                                    name: partner.firstname,
                                }) as string
                            }
                        >
                            <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                        </IonButton>
                    )}
                    <h2 className={styles.title}>{t('chat.medias.title')}</h2>
                    <div style={{ width: '50px' }} aria-hidden="true" />
                </div>
                <IonList lines="none" className={styles['header-filters']}>
                    <IonItem
                        button={true}
                        detail={false}
                        onClick={() => setSelectedFilter(MessageType.Image)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.Image ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.images')}</IonLabel>
                    </IonItem>
                    <IonItem
                        button={true}
                        detail={false}
                        onClick={() => setSelectedFilter(MessageType.File)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.File ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.files')}</IonLabel>
                    </IonItem>
                    <IonItem
                        button={true}
                        detail={false}
                        onClick={() => setSelectedFilter(MessageType.Audio)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.Audio ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.audios')}</IonLabel>
                    </IonItem>
                    <IonItem
                        button={true}
                        detail={false}
                        onClick={() => setSelectedFilter(MessageType.Link)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.Link ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.links')}</IonLabel>
                    </IonItem>
                </IonList>
            </div>
            {isLoading ? (
                <div className={styles.loader}>
                    <Loader />
                </div>
            ) : (
                <MediasList
                    messages={messages}
                    loadMessages={() => onLoadMessages({ isFirstMessage: false })}
                    isScrollOver={isScrollForwardOver}
                    selectedFilter={selectedFilter}
                    setImageToDisplay={setImageToDisplay}
                />
            )}
        </div>
    );
};

const MediaContent: React.FC<MediaContentProps> = ({ conversation, isHybrid, goBack, profile, setImageToDisplay }) => {
    if (!isHybrid) {
        return (
            <Content
                conversation={conversation}
                goBack={goBack}
                profile={profile}
                setImageToDisplay={setImageToDisplay}
            />
        );
    }

    return (
        <IonPage>
            <Content
                conversation={conversation}
                goBack={goBack}
                profile={profile}
                setImageToDisplay={setImageToDisplay}
            />
        </IonPage>
    );
};

export default MediaContent;
