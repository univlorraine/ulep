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

/* eslint-disable max-classes-per-file */
import { differenceInCalendarDays, format, isToday, isYesterday } from 'date-fns';

export enum MessagePaginationDirection {
    BACKWARD = 'backward',
    FORWARD = 'forward',
    BOTH = 'both',
}

class MediaObject {
    constructor(
        public readonly id: string,
        public readonly mimeType: string
    ) {}
}

export class UserChat {
    constructor(
        public readonly id: string,
        public readonly firstname: string,
        public readonly lastname: string,
        public readonly email: string,
        public readonly isAdministrator: boolean,
        public readonly avatar?: MediaObject
    ) {}
}

export enum MessageType {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    File = 'file',
    Link = 'link',
}

interface MessageMetadata {
    originalFilename: string;
    openGraphResult: any;
}

export class MessageWithoutSender {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly senderId: string,
        public readonly type: MessageType,
        public readonly metadata: MessageMetadata
    ) {}

    public getMessageDate(): string {
        const now = new Date();
        if (isToday(this.createdAt)) {
            // If the date is today, return the time
            return 'date.today';
        }
        if (isYesterday(this.createdAt)) {
            // If the date is yesterday, return 'Yesterday'
            return 'date.yesterday';
        }
        const daysDifference = differenceInCalendarDays(now, this.createdAt);
        if (daysDifference < 7) {
            // If the date is less than 7 days, return the day of the week
            return `days.${format(this.createdAt, 'EEEE').toLowerCase()}`;
        }

        // If the date is not today or yesterday, return the date in the format 'dd/MM'
        return format(this.createdAt, 'dd/MM');
    }

    public getMessageHour(): string {
        return format(this.createdAt, 'HH:mm');
    }

    public isMine(userId: string): boolean {
        return this.senderId === userId;
    }
}

export class Message extends MessageWithoutSender {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly sender: UserChat,
        public readonly type: MessageType,
        public readonly metadata: MessageMetadata
    ) {
        super(id, content, createdAt, sender.id, type, metadata);
    }
}

export class MessageWithConversationId extends Message {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly sender: UserChat,
        public readonly type: MessageType,
        public readonly conversationId: string,
        public readonly metadata: any
    ) {
        super(id, content, createdAt, sender, type, metadata);
    }
}
