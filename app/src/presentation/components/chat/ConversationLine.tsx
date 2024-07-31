import { IonButton, IonItem } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import MediaObject from '../../../domain/entities/MediaObject';
import Conversation from '../../../domain/entities/chat/Conversation';
import { Message } from '../../../domain/entities/chat/Message';
import NetworkImage from '../NetworkImage';
import styles from './ConversationLine.module.css';

interface ConversationAvatarProps {
    avatar?: MediaObject;
    firstname: string;
    lastname: string;
}

const ConversationAvatar: React.FC<ConversationAvatarProps> = ({ avatar, firstname, lastname }) => {
    return (
        <>
            {avatar && <NetworkImage className={styles.image} id={avatar.id} aria-hidden={true} />}
            {!avatar && (
                <div className={styles.image} aria-hidden={true}>
                    <span className={styles.avatarLetter}>
                        {firstname[0].toUpperCase()}
                        {lastname[0].toUpperCase()}
                    </span>
                </div>
            )}
        </>
    );
};

const getPreviewMessage = (userId: string, translate: (key: string) => string, message?: Message) => {
    if (!message) {
        return translate('message.type.noMessage');
    }
    switch (message.type) {
        case 'image':
            return translate('message.type.image');
        case 'audio':
            return translate('message.type.audio');
        case 'file':
            return translate('message.type.file');
        default:
            if (message.isMine(userId)) {
                return message.content;
            }
            return `${message.sender.firstname}: ${message.content}`;
    }
};

interface ConversationLineProps {
    conversation: Conversation;
    userId: string;
    onPressed: (conversation: Conversation) => void;
}

const ConversationLine: React.FC<ConversationLineProps> = ({ conversation, onPressed, userId }) => {
    const { t } = useTranslation();
    const mainParticipant = conversation.getMainConversationPartner(userId);
    return (
        <IonItem className={styles.line}>
            <IonButton
                fill="clear"
                onClick={() => onPressed(conversation)}
                className={styles.button}
                aria-label={t('chat.conversation_menu.aria_label') as string}
            >
                <ConversationAvatar
                    avatar={mainParticipant.avatar}
                    firstname={mainParticipant.firstname}
                    lastname={mainParticipant.lastname}
                />
                <div className={styles.content}>
                    <div className={styles['top-line']}>
                        <span className={styles.name}>{mainParticipant.firstname}</span>
                        {conversation.lastMessage && (
                            <span className={styles.date}>{`${t(
                                conversation.lastMessage.getMessageDate()
                            )} ${conversation.lastMessage.getMessageHour()}`}</span>
                        )}
                    </div>
                    <span className={styles.message}>{getPreviewMessage(userId, t, conversation.lastMessage)}</span>
                </div>
            </IonButton>
        </IonItem>
    );
};

export default ConversationLine;
