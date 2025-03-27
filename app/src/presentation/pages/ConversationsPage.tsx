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

import { IonContent, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import Conversation from '../../domain/entities/chat/Conversation';
import { useStoreState } from '../../store/storeTypes';
import ChatContent from '../components/contents/ChatContent';
import ConversationsContent from '../components/contents/ConversationsContent';
import MediaContent from '../components/contents/MediaContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import Modal from '../components/modals/Modal';
import useGetConversations from '../hooks/useGetConversations';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import styles from './css/ConversationsPage.module.css';

interface ConversationsPageParams {
    tandemId: string;
    conversation: Conversation | undefined;
}

const ConversationsPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation<ConversationsPageParams>();
    const { tandemId } = location.state || {};
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [currentConversation, setCurrentConversation] = useState<Conversation | undefined>();
    const [currentContent, setCurrentContent] = useState<string>('chat');
    const [imageToDisplay, setImageToDisplay] = useState<string | undefined>();

    const showImageModal = (imageUrl: string) => {
        setImageToDisplay(imageUrl);
    };

    const { conversations, error, isLoading } = useGetConversations();

    useEffect(() => {
        if (tandemId && !currentConversation) {
            setCurrentConversation(conversations.find((conversation) => conversation.id === tandemId));
        }
    }, [conversations]);

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <IonContent>
                <ConversationsContent
                    conversations={conversations}
                    profile={profile}
                    isHybrid={isHybrid}
                    isLoading={isLoading}
                    onConversationPressed={(conversation) => history.push(`/chat`, { conversation })}
                />
            </IonContent>
        );
    }

    return (
        <>
            <OnlineWebLayout>
                <div className={styles.container}>
                    <div className={styles.conversationContent}>
                        <ConversationsContent
                            conversations={conversations}
                            profile={profile}
                            isHybrid={isHybrid}
                            isLoading={isLoading}
                            onConversationPressed={(conversation) => setCurrentConversation(conversation)}
                            currentConversation={currentConversation}
                        />
                    </div>
                    {currentConversation && (
                        <div className={styles.chatContent}>
                            {currentContent === 'chat' && (
                                <ChatContent
                                    conversation={currentConversation}
                                    profile={profile}
                                    isHybrid={isHybrid}
                                    setCurrentContent={setCurrentContent}
                                    setImageToDisplay={showImageModal}
                                />
                            )}
                            {currentContent === 'media' && (
                                <MediaContent
                                    conversation={currentConversation}
                                    profile={profile}
                                    isHybrid={isHybrid}
                                    goBack={() => setCurrentContent('chat')}
                                    setImageToDisplay={showImageModal}
                                />
                            )}
                        </div>
                    )}
                </div>
            </OnlineWebLayout>
            <Modal
                className={styles.modal}
                isVisible={Boolean(imageToDisplay)}
                onClose={() => setImageToDisplay(undefined)}
            >
                <img className={styles['image-modal']} src={imageToDisplay} />
            </Modal>
        </>
    );
};

export default ConversationsPage;
