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

import { Module, Provider } from '@nestjs/common';
import { PrismaService, RedisModule } from '@app/common';
import { STORAGE_INTERFACE } from 'src/core/ports/storage.interface';
import { MinioStorage } from './storage/minio.storage';
import { ConfigModule } from '@nestjs/config';
import { MESSAGE_REPOSITORY } from 'src/core/ports/message.repository';
import { PrismaMessageRepository } from 'src/providers/persistance/repositories/prisma-message.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';
import { CONVERSATION_REPOSITORY } from 'src/core/ports/conversation.repository';
import { PrismaConversationRepository } from 'src/providers/persistance/repositories/prisma-conversation.repository';
import { MEDIA_OBJECT_REPOSITORY } from 'src/core/ports/media-object.repository';
import { PrismaMediaObjectRepository } from 'src/providers/persistance/repositories/prisma-media-object.repository';
import { HUB_GATEWAY } from 'src/core/ports/hub.gateway';
import { HubGateway } from 'src/providers/gateway/hub.gateway';
import { ROOM_REPOSITORY } from 'src/core/ports/room.repository';
import { RedisRoomService } from 'src/providers/services/room.service';
import { NOTIFICATION_SERVICE } from 'src/core/ports/notification.service';
import { NotificationService } from 'src/providers/services/notification.service';
import { HASHTAG_REPOSITORY } from 'src/core/ports/hastag.repository';
import { PrismaHashtagRepository } from 'src/providers/persistance/repositories/prisma-hashtag.repository';

const providers: Provider[] = [
    {
        provide: UUID_PROVIDER,
        useClass: UuidProvider,
    },
    {
        provide: STORAGE_INTERFACE,
        useClass: MinioStorage,
    },
    {
        provide: MEDIA_OBJECT_REPOSITORY,
        useClass: PrismaMediaObjectRepository,
    },
    {
        provide: MESSAGE_REPOSITORY,
        useClass: PrismaMessageRepository,
    },
    {
        provide: CONVERSATION_REPOSITORY,
        useClass: PrismaConversationRepository,
    },
    {
        provide: HUB_GATEWAY,
        useClass: HubGateway,
    },
    {
        provide: ROOM_REPOSITORY,
        useClass: RedisRoomService,
    },
    {
        provide: NOTIFICATION_SERVICE,
        useClass: NotificationService,
    },
    {
        provide: HASHTAG_REPOSITORY,
        useClass: PrismaHashtagRepository,
    },
];

@Module({
    imports: [ConfigModule, RedisModule],
    providers: [PrismaService, ...providers],
    exports: [...providers],
})
export class ProvidersModule {}
