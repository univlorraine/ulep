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

export enum MessageType {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    File = 'file',
    Link = 'link',
    Vocabulary = 'vocabulary',
    Activity = 'activity',
}

interface MessageLikeProps {
    messageId: string;
    userId: string;
}

export class MessageLike {
    readonly messageId: string;
    readonly userId: string;

    constructor(props: MessageLikeProps) {
        this.messageId = props.messageId;
        this.userId = props.userId;
    }
}

interface MessageProps {
    id: string;
    conversationId: string;
    content: string;
    isReported: boolean;
    isDeleted: boolean;
    ownerId: string;
    usersLiked: MessageLike[];
    numberOfReplies: number;
    type: MessageType;
    createdAt?: Date;
    updatedAt?: Date;
    metadata?: any;
    parent?: Message;
}

export class Message {
    readonly id: string;
    content: string;
    readonly conversationId: string;
    readonly isReported: boolean;
    readonly isDeleted: boolean;
    readonly ownerId: string;
    readonly usersLiked: MessageLike[];
    readonly numberOfReplies: number;
    readonly type: MessageType;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly metadata?: any;
    readonly parent?: Message;

    constructor(props: MessageProps) {
        this.id = props.id;
        this.content = props.content;
        this.conversationId = props.conversationId;
        this.createdAt = props.createdAt;
        this.isReported = props.isReported;
        this.isDeleted = props.isDeleted;
        this.ownerId = props.ownerId;
        this.usersLiked = props.usersLiked;
        this.numberOfReplies = props.numberOfReplies;
        this.type = props.type;
        this.updatedAt = props.updatedAt;
        this.metadata = props.metadata;
        this.parent = props.parent;
    }

    public static categorizeFileType(mimeType?: string): MessageType {
        if (!mimeType) {
            return MessageType.Text;
        } else if (mimeType.startsWith('audio/')) {
            return MessageType.Audio;
        } else if (mimeType.startsWith('image/')) {
            return MessageType.Image;
        } else {
            return MessageType.File;
        }
    }
}
