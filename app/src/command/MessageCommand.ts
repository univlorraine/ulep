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

import { Message, MessageType, MessageWithoutSender } from '../domain/entities/chat/Message';
import { ActivityCommand, activityCommandToDomain } from './ActivityCommand';
import UserChatCommand, { userChatCommandToDomain } from './UserChatCommand';
import VocabularyListCommand, { vocabularyListCommandToDomain } from './VocabularyListCommand';

interface MessageMetadataCommand {
    activity?: ActivityCommand;
    vocabularyList?: VocabularyListCommand;
    openGraphResult?: any;
}
//From Domain api
export interface MessageCommand {
    id: string;
    content: string;
    createdAt: Date;
    user: UserChatCommand;
    type: string;
    metadata: any;
    likes: number;
    didLike: boolean;
    numberOfReplies: number;
    isDeleted: boolean;
    parent?: MessageCommand;
}

// From Chat api
export interface MessageWithoutSenderCommand extends MessageCommand {
    ownerId: string;
}

export const messageWithoutSenderCommandToDomain = (command: MessageWithoutSenderCommand) => {
    return new MessageWithoutSender(
        command.id,
        command.content,
        new Date(command.createdAt),
        command.ownerId,
        command.type as MessageType,
        command.likes,
        command.didLike,
        {
            ...command.metadata,
            activity: command.metadata.activity ? activityCommandToDomain(command.metadata.activity) : undefined,
            vocabularyList: command.metadata.vocabularyList
                ? vocabularyListCommandToDomain(command.metadata.vocabularyList)
                : undefined,
        },
        command.numberOfReplies,
        command.isDeleted
    );
};

export const messageCommandToDomain = (command: MessageCommand) => {
    return new Message(
        command.id,
        command.content,
        new Date(command.createdAt),
        userChatCommandToDomain(command.user),
        command.type as MessageType,
        command.likes,
        command.didLike,
        {
            ...command.metadata,
            activity: command.metadata.activity ? activityCommandToDomain(command.metadata.activity) : undefined,
            vocabularyList: command.metadata.vocabularyList
                ? vocabularyListCommandToDomain(command.metadata.vocabularyList)
                : undefined,
        },
        command.numberOfReplies,
        command.isDeleted,
        command.parent?.id,
        command.parent
            ? new Message(
                  command.parent.id,
                  command.parent.content,
                  new Date(command.parent.createdAt),
                  userChatCommandToDomain(command.parent.user),
                  command.parent.type as MessageType,
                  command.parent.likes,
                  command.parent.didLike,
                  {
                      ...command.metadata,
                      activity: command.parent.metadata.activity
                          ? activityCommandToDomain(command.parent.metadata.activity)
                          : undefined,
                      vocabularyList: command.parent.metadata.vocabularyList
                          ? vocabularyListCommandToDomain(command.parent.metadata.vocabularyList)
                          : undefined,
                  },
                  command.parent.numberOfReplies
              )
            : undefined
    );
};
