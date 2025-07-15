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
