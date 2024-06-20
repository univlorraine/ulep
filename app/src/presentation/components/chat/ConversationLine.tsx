import React from 'react';
import styles from './ConversationLine.module.css';
import Conversation from '../../../domain/entities/chat/Conversation';
import NetworkImage from '../NetworkImage';
import MediaObject from '../../../domain/entities/MediaObject';
import { Message } from '../../../domain/entities/chat/Message';
import { useTranslation } from 'react-i18next';

//TODO: Sort covnersation by last message date or conversation creation date

interface ConversationAvatarProps {
    avatar?: MediaObject;
    firstname: string;
    lastname: string;
}

const ConversationAvatar: React.FC<ConversationAvatarProps> = ({ avatar, firstname, lastname }) => {
    return (
        <>
            {avatar && <NetworkImage className={styles.image} id={avatar.id} />}
            {!avatar && (
                <div className={styles.image}>
                    <span className={styles.avatarLetter}>
                        {firstname[0].toUpperCase()}
                        {lastname[0].toUpperCase()}
                    </span>
                </div>
            )}
        </>
    );
};

const getPreviewMessage = (userId: string, message?: Message) => {
    if (!message) {
        return 'message.type.noMessage';
    }
    switch (message.type) {
        case 'image':
            return 'message.type.image';
        case 'audio':
            return 'message.type.audio';
        case 'file':
            return 'message.type.file';
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
        <button className={styles.line} onClick={() => onPressed(conversation)}>
            <div className={styles['left-line']}>
                <ConversationAvatar
                    avatar={mainParticipant.avatar}
                    firstname={mainParticipant.firstname}
                    lastname={mainParticipant.lastname}
                />
                <div className={styles.content}>
                    <span className={styles.name}>{mainParticipant.firstname}</span>
                    <span className={styles.message}>{t(getPreviewMessage(userId, conversation.lastMessage))}</span>
                </div>
            </div>
            {conversation.lastMessage && (
                <span className={styles.date}>{`${t(
                    conversation.lastMessage.getMessageDate()
                )} ${conversation.lastMessage.getMessageHour()}`}</span>
            )}
        </button>
    );
};

export default ConversationLine;
