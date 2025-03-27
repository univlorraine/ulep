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

import { IonAvatar, IonButton, IonIcon, IonPopover, IonText, useIonToast } from '@ionic/react';
import { alertCircleOutline, arrowUndoOutline, thumbsUpOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KebabSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import NetworkImage from '../NetworkImage';
import styles from './MessageComponent.module.css';
import MessageActivity from './messages/MessageActivity';
import MessageAudio from './messages/MessageAudio';
import MessageDeleted from './messages/MessageDeleted';
import MessageFile from './messages/MessageFile';
import MessageImage from './messages/MessageImage';
import MessageLink from './messages/MessageLink';
import MessageParent from './messages/MessageParent';
import MessageText from './messages/MessageText';
import MessageVocabulary from './messages/MessageVocabulary';

interface ChatAvatarProps {
    avatar?: string;
    firstname: string;
    lastname: string;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ avatar, firstname, lastname }) => (
    <NetworkImage
        className={styles.avatarContainer}
        id={avatar ?? ''}
        aria-hidden={true}
        onErrorComponent={() => (
            <IonAvatar className={styles.image} aria-hidden={true}>
                <span className={styles.avatarLetter}>
                    {firstname[0].toUpperCase()}
                    {lastname[0].toUpperCase()}
                </span>
            </IonAvatar>
        )}
    />
);

export interface MessageProps {
    isCurrentUserMessage: boolean;
    isCommunity: boolean;
    message: Message;
    isInReply?: boolean;
    hideContextMenu?: boolean;
    currentMessageSearchId?: string;
    onMessagePressed?: (e: React.MouseEvent<HTMLIonButtonElement>) => void;
    onLikeMessage?: (messageId: string) => void;
    onUnlikeMessage?: (messageId: string) => void;
    setImageToDisplay?: (imageUrl: string) => void;
    onReplyToMessage?: (message: Message) => void;
}

const MessageComponent: React.FC<MessageProps> = ({
    message,
    isCurrentUserMessage,
    isCommunity,
    isInReply,
    hideContextMenu,
    currentMessageSearchId,
    setImageToDisplay,
    onLikeMessage,
    onUnlikeMessage,
    onReplyToMessage,
}) => {
    const { t } = useTranslation();
    const { createReportMessage } = useConfig();
    const [showToast] = useIonToast();
    const headerClass = isCurrentUserMessage ? styles.alignRight : styles.alignLeft;
    const name = isCurrentUserMessage ? t('chat.me') : `${message.sender.firstname} ${message.sender.lastname}`;
    const date = `${t(message.getMessageDate())} ${message.getMessageHour()}`;
    const [displayPopover, setDisplayPopover] = useState<boolean>(false);
    const [popoverEvent, setPopoverEvent] = useState<React.MouseEvent<HTMLIonButtonElement> | null>(null);

    const reportMessage = async () => {
        const result = await createReportMessage.execute({
            content: t(
                message.type === MessageType.Text || message.type === MessageType.Link
                    ? 'chat.messageReport'
                    : 'chat.mediaReport',
                {
                    firstname: message.sender.firstname,
                    lastname: message.sender.lastname,
                    date: message.createdAt.toLocaleDateString('fr-FR'),
                    message: message.content,
                }
            ),
            reportedUserId: message.sender.id,
            filePath: message.metadata?.filePath,
            mediaType: message.type,
            messageId: message.id,
        });

        setDisplayPopover(false);

        if (result instanceof Error) {
            return showToast({
                message: t(result.message),
                duration: 2000,
            });
        }

        return showToast({
            message: t('chat.messageReported'),
            duration: 2000,
        });
    };

    const manageLikeOnMessage = () => {
        if (message.didLike) {
            onUnlikeMessage?.(message.id);
        } else {
            onLikeMessage?.(message.id);
        }
        setDisplayPopover(false);
    };

    const replyToMessage = () => {
        onReplyToMessage?.(message);
        setDisplayPopover(false);
    };

    const onOpenActionsPopover = (e: React.MouseEvent<HTMLIonButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPopoverEvent(e);
        setDisplayPopover(!displayPopover);
    };

    const renderMessageContent = (message: Message) => {
        if (message.isDeleted) {
            return (
                <MessageDeleted
                    message={message}
                    isCurrentUserMessage={isCurrentUserMessage}
                    isCommunity={isCommunity}
                />
            );
        }

        switch (message.type) {
            case MessageType.Text:
                return (
                    <MessageText
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                        currentMessageSearchId={currentMessageSearchId}
                    />
                );
            case MessageType.Image:
                return (
                    <MessageImage
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                        setImageToDisplay={setImageToDisplay}
                    />
                );
            case MessageType.Audio:
                return (
                    <MessageAudio
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                    />
                );
            case MessageType.File:
                return (
                    <MessageFile
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                    />
                );
            case MessageType.Link:
                return (
                    <MessageLink
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                        currentMessageSearchId={currentMessageSearchId}
                    />
                );
            case MessageType.Vocabulary:
                return (
                    <MessageVocabulary
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                    />
                );
            case MessageType.Activity:
                return (
                    <MessageActivity
                        message={message}
                        isCurrentUserMessage={isCurrentUserMessage}
                        isCommunity={isCommunity}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className={styles.messageContainer}>
                <div className={`${styles.header} ${headerClass}`}>
                    <IonText className={styles.name}>{name}</IonText>
                    <IonText className={styles.date}>{date}</IonText>
                </div>
                {message.parent && <MessageParent>{renderMessageContent(message.parent)}</MessageParent>}
                <div className={styles.messageContent}>
                    {isCommunity && !isCurrentUserMessage && (
                        <ChatAvatar
                            avatar={message.sender.avatar?.id}
                            firstname={message.sender.firstname}
                            lastname={message.sender.lastname}
                        />
                    )}
                    {renderMessageContent(message)}
                    {!isCurrentUserMessage && !hideContextMenu && (
                        <IonButton
                            aria-label={t('chat.open_message_menu') as string}
                            fill="clear"
                            className={styles.rightMessageMenu}
                            onClick={onOpenActionsPopover}
                            size="small"
                        >
                            <IonIcon icon={KebabSvg} />
                        </IonButton>
                    )}
                </div>
                {!isInReply && message.numberOfReplies > 0 && (
                    <IonButton
                        aria-label={t('chat.open_replies') as string}
                        fill="clear"
                        className={`${styles.reply} ${isCurrentUserMessage ? styles.rightReply : styles.leftReply} ${
                            message.likes > 0 ? styles.replyWithLike : styles.replyWithoutLike
                        }`}
                        size="small"
                        onClick={() => onReplyToMessage?.(message)}
                    >
                        {t(message.numberOfReplies > 1 ? 'chat.numberOfReplies_plural' : 'chat.numberOfReplies', {
                            count: message.numberOfReplies,
                        })}
                    </IonButton>
                )}
            </div>
            <IonPopover
                event={popoverEvent}
                side="bottom"
                alignment="center"
                size="auto"
                showBackdrop={false}
                isOpen={displayPopover}
                onDidPresent={() => setDisplayPopover(true)}
                onDidDismiss={() => setDisplayPopover(false)}
                className={styles.fullHeightPopover}
            >
                {isCommunity && (
                    <IonButton
                        aria-label={
                            message.didLike
                                ? (t('chat.unlikeMessageButton') as string)
                                : (t('chat.likeMessageButton') as string)
                        }
                        fill="clear"
                        className={styles.contextButton}
                        onClick={manageLikeOnMessage}
                    >
                        <IonIcon icon={thumbsUpOutline} className={styles.contextButtonIcon} />
                        <IonText className={styles.contextButtonText}>
                            {message.didLike ? t('chat.unlikeMessageButton') : t('chat.likeMessageButton')}
                        </IonText>
                    </IonButton>
                )}
                {isCommunity && !isInReply && (
                    <IonButton
                        aria-label={t('chat.replyMessageButton') as string}
                        fill="clear"
                        className={styles.contextButton}
                        onClick={replyToMessage}
                    >
                        <IonIcon icon={arrowUndoOutline} className={styles.contextButtonIcon} />
                        <IonText className={styles.contextButtonText}>{t('chat.replyMessageButton')}</IonText>
                    </IonButton>
                )}
                <IonButton
                    aria-label={t('chat.reportMessageButton') as string}
                    fill="clear"
                    className={styles.contextButton}
                    onClick={reportMessage}
                >
                    <IonIcon icon={alertCircleOutline} className={styles.contextButtonIcon} />
                    <IonText className={styles.contextButtonText}>{t('chat.reportMessageButton')}</IonText>
                </IonButton>
            </IonPopover>
        </>
    );
};

export default MessageComponent;
