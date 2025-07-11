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

import * as Prisma from '@prisma/client';
import { parseArgs } from 'node:util';
import {
    createSampleConversations,
    createBulkConversations,
} from './conversation';
import {
    createSampleMessages,
    createMessageWithReplies,
    createMessageWithLikes,
    createBulkMessages,
} from './messages';
import {
    createSampleHashtags,
    createBulkHashtags,
    createSpecificHashtags,
} from './hashtags';

const prisma = new Prisma.PrismaClient();

const load = async () => {
    try {
        const { values } = parseArgs({
            options: {
                delete: { type: 'boolean' },
                seed: { type: 'string' },
                conversations: { type: 'string' },
                messages: { type: 'string' },
                hashtags: { type: 'string' },
            },
        });

        const deleteCurrent = !!values.delete;
        const seedType = values.seed;
        const conversationCount =
            parseInt(values.conversations as string) || 1000;
        const messagesPerConversation =
            parseInt(values.messages as string) || 5;
        const hashtagsPerConversation =
            parseInt(values.hashtags as string) || 3;

        if (deleteCurrent) {
            console.info('[DB seed] delete existing data');
            await prisma.messageLike.deleteMany();
            await prisma.hashtag.deleteMany();
            await prisma.message.deleteMany();
            await prisma.conversation.deleteMany();
        }

        console.info('[DB seed] creating conversations...');
        await createSampleConversations(prisma);
        await createBulkConversations(prisma, conversationCount);

        console.info('[DB seed] creating messages...');
        await createSampleMessages(prisma);
        await createMessageWithReplies(prisma);
        await createMessageWithLikes(prisma);
        await createBulkMessages(prisma, messagesPerConversation);

        console.info('[DB seed] creating hashtags...');
        await createSampleHashtags(prisma);
        await createBulkHashtags(prisma, hashtagsPerConversation);
        await createSpecificHashtags(prisma);

        if (seedType === 'full') {
            console.info('[DB seed] full dataset with additional features');
            // Ajouter des fonctionnalités supplémentaires si nécessaire
        } else if (seedType === 'minimal') {
            console.info('[DB seed] minimal dataset');
            // Version minimale avec moins de données
        } else {
            console.info('[DB seed] standard dataset');
        }

        console.info('[DB seed] completed successfully');
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

load();
