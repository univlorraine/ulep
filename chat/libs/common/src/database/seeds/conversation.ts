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

import { PrismaClient } from '@prisma/client';

const sampleConversations = [
    {
        participantIds: ['user1', 'user2'],
        metadata: { type: 'language-exchange' },
    },
    {
        participantIds: ['user3', 'user4', 'user5'],
        metadata: { type: 'multilingual' },
    },
    {
        participantIds: ['user6', 'user7'],
        metadata: { type: 'pronunciation-help' },
    },
];

const conversationTypes = [
    'language-exchange',
    'study-group',
    'casual-chat',
    'tandem-practice',
    'cultural-exchange',
];

const generateRandomId = (): string => {
    return `user${Math.floor(Math.random() * 10000)}`;
};

const generateRandomParticipants = (): string[] => {
    const participantCount = Math.floor(Math.random() * 3) + 2; // 2-4 participants
    const participants = new Set<string>();

    while (participants.size < participantCount) {
        participants.add(generateRandomId());
    }

    return Array.from(participants);
};

export const createSampleConversations = async (
    prisma: PrismaClient,
): Promise<void> => {
    for (const conversationData of sampleConversations) {
        await prisma.conversation.create({
            data: {
                participantIds: conversationData.participantIds,
                lastActivityAt: new Date(),
                metadata: conversationData.metadata,
            },
        });
    }
};

export const createBulkConversations = async (
    prisma: PrismaClient,
    count: number = 1000,
): Promise<void> => {
    console.log(`🚀 Création de ${count} conversations...`);

    const batchSize = 50; // Traitement par lots pour optimiser les performances
    const totalBatches = Math.ceil(count / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
        const currentBatchSize = Math.min(batchSize, count - batch * batchSize);

        console.log(
            `📦 Traitement du lot ${
                batch + 1
            }/${totalBatches} (${currentBatchSize} conversations)`,
        );

        for (let i = 0; i < currentBatchSize; i++) {
            const participantIds = generateRandomParticipants();
            const conversationType =
                conversationTypes[
                    Math.floor(Math.random() * conversationTypes.length)
                ];

            // Créer la conversation
            await prisma.conversation.create({
                data: {
                    participantIds,
                    lastActivityAt: new Date(
                        Date.now() - Math.random() * 86400000,
                    ), // Random time in last 24h
                    metadata: {
                        type: conversationType,
                        generated: true,
                        batch: batch + 1,
                    },
                },
            });
        }

        console.log(`✅ Lot ${batch + 1} terminé`);
    }

    console.log(
        `🎉 Création terminée ! ${count} conversations générées avec succès.`,
    );
};
