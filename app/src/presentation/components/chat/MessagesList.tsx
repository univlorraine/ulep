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

import { IonText } from '@ionic/react';
import { isSameDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { MessagePaginationDirection } from '../../../domain/entities/chat/Conversation';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import { useMessages } from '../../hooks/useMessages';
import Loader from '../Loader';
import MessageComponent from './MessageComponent';
import styles from './MessagesList.module.css';

interface MessagesListProps {
    currentMessageSearchId?: string;
    messages: Message[];
    messageToReply?: Message;
    isCommunity: boolean;
    isScrollForwardOver: boolean;
    isScrollBackwardOver: boolean;
    loadMessages: (direction: MessagePaginationDirection) => void;
    onLikeMessage: (messageId: string) => void;
    onUnlikeMessage: (messageId: string) => void;
    onReplyToMessage: (message: Message) => void;
    userId: string;
    setImageToDisplay: (imageUrl: string) => void;
    onCancelReply: () => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
    currentMessageSearchId,
    messages,
    messageToReply,
    isCommunity,
    isScrollForwardOver,
    isScrollBackwardOver,
    loadMessages,
    userId,
    setImageToDisplay,
    onLikeMessage,
    onUnlikeMessage,
    onReplyToMessage,
    onCancelReply,
}) => {
    const { t } = useTranslation();
    const { isLoading, messagesEndRef, handleScroll } = useMessages({
        messages,
        isScrollForwardOver,
        isScrollBackwardOver,
        isSearchMode: Boolean(currentMessageSearchId),
        loadMessages,
    });

    const renderMessages = () => {
        const messageElements: React.ReactNode[] = [];
        let lastDate: Date | null = null;

        if (messages.length === 0)
            return (
                <div className={styles['no-messages']}>
                    <IonText>{t('chat.noMessages')}</IonText>
                </div>
            );

        const reversedMessages = [...messages].reverse();

        reversedMessages.forEach((message) => {
            const messageDate = new Date(message.createdAt);
            const isCurrentUserMessage = message.isMine(userId);

            if (!Boolean(messageToReply) && (!lastDate || !isSameDay(lastDate, messageDate))) {
                messageElements.push(
                    <div key={`id-${message.id}`} className={styles.dateSeparator}>
                        {t(message.getMessageDate())}
                    </div>
                );
                lastDate = messageDate;
            }

            if (message.content) {
                messageElements.push(
                    <div
                        ref={message.id === currentMessageSearchId ? messagesEndRef : null}
                        role="listitem"
                        key={message.id}
                        className={isCurrentUserMessage ? styles.currentUser : styles.otherUser}
                    >
                        <MessageComponent
                            currentMessageSearchId={currentMessageSearchId}
                            message={message}
                            isCurrentUserMessage={isCurrentUserMessage}
                            isCommunity={isCommunity}
                            setImageToDisplay={message.type === MessageType.Image ? setImageToDisplay : undefined}
                            onLikeMessage={onLikeMessage}
                            onUnlikeMessage={onUnlikeMessage}
                            onReplyToMessage={onReplyToMessage}
                            isInReply={Boolean(messageToReply)}
                        />
                    </div>
                );
            }
        });

        return messageElements;
    };

    return (
        <div
            className={`${styles.messages} ${isCommunity ? styles.messagesCommunity : ''}`}
            onScroll={handleScroll}
            role="list"
        >
            {isLoading && (
                <div className={styles.loader}>
                    {/* TODO: Upgrade to use a better loader */}
                    <Loader color="#000" height={30} width={30} />
                </div>
            )}
            {renderMessages()}
            <div ref={!currentMessageSearchId ? messagesEndRef : null} />
        </div>
    );
};

export default MessagesList;
