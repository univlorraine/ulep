import { IonAvatar, IonItem } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Conversation from '../../../domain/entities/chat/Conversation';
import { Message, MessageType } from '../../../domain/entities/chat/Message';
import Language from '../../../domain/entities/Language';
import { codeLanguageToFlag } from '../../utils';
import NetworkImage from '../NetworkImage';
import styles from './ConversationLine.module.css';

interface ConversationAvatarProps {
    avatar: string;
    firstname: string;
    lastname: string;
}

const ConversationAvatar: React.FC<ConversationAvatarProps> = ({ avatar, firstname, lastname }) => {
    return (
        <NetworkImage
            className={styles.image}
            id={avatar}
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
};

interface CommunityConversationAvatarProps {
    primaryLanguage?: Language;
    partnerLanguage?: Language;
}

const CommunityConversationAvatar: React.FC<CommunityConversationAvatarProps> = ({
    primaryLanguage,
    partnerLanguage,
}) => {
    return (
        <div className={styles.communityAvatar}>
            {partnerLanguage && (
                <span className={styles.partnerLanguage}>{codeLanguageToFlag(partnerLanguage.code)}</span>
            )}
            {primaryLanguage && (
                <span className={styles.primaryLanguage}>{codeLanguageToFlag(primaryLanguage.code)}</span>
            )}
        </div>
    );
};

const getPreviewMessage = (userId: string, translate: (key: string) => string, message?: Message) => {
    if (!message) {
        return translate('message.type.noMessage');
    }
    switch (message.type) {
        case MessageType.Image:
            return translate('message.type.image');
        case MessageType.Audio:
            return translate('message.type.audio');
        case MessageType.File:
            return translate('message.type.file');
        case MessageType.Vocabulary:
            return translate('message.type.vocabulary');
        case MessageType.Activity:
            return translate('message.type.activity');
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
    currentConversation?: Conversation;
}

//TODO: Handle no partner in conversation for community chat
const ConversationLine: React.FC<ConversationLineProps> = ({
    conversation,
    currentConversation,
    onPressed,
    userId,
}) => {
    const { t } = useTranslation();
    const partner = Conversation.getMainConversationPartner(conversation, userId);
    const name =
        conversation.isForCommunity && conversation.centralLanguage && conversation.partnerLanguage
            ? t('chat.community.name', {
                  firstLanguage: t(`languages_code.${conversation.centralLanguage.code}`),
                  secondLanguage: t(`languages_code.${conversation.partnerLanguage.code}`),
              })
            : partner.firstname;
    return (
        <IonItem
            className={styles.line}
            button={true}
            onClick={() => onPressed(conversation)}
            aria-label={t('chat.conversation_menu.user_aria_label', { name: partner.firstname }) as string}
            color={conversation.id === currentConversation?.id ? 'light' : undefined}
        >
            <div className={styles.container}>
                {conversation.isForCommunity ? (
                    <CommunityConversationAvatar
                        primaryLanguage={conversation.centralLanguage}
                        partnerLanguage={conversation.partnerLanguage}
                    />
                ) : (
                    <ConversationAvatar
                        avatar={partner.avatar?.id || partner.id}
                        firstname={partner.firstname}
                        lastname={partner.lastname}
                    />
                )}
                <div className={styles.content}>
                    <div className={styles['top-line']}>
                        <span className={styles.name}>{name}</span>
                        {conversation.lastMessage && (
                            <span className={styles.date}>{`${t(
                                conversation.lastMessage.getMessageDate()
                            )} ${conversation.lastMessage.getMessageHour()}`}</span>
                        )}
                    </div>
                    <span className={styles.message}>{getPreviewMessage(userId, t, conversation.lastMessage)}</span>
                </div>
            </div>
        </IonItem>
    );
};

export default ConversationLine;
