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

const hashtags = [
    '#language-exchange',
    '#english',
    '#french',
    '#spanish',
    '#german',
    '#italian',
    '#pronunciation',
    '#grammar',
    '#vocabulary',
    '#culture',
    '#travel',
    '#food',
    '#music',
    '#movies',
    '#books',
    '#sports',
    '#technology',
    '#art',
    '#history',
    '#science',
    '#business',
    '#education',
    '#multilingual',
    '#group-chat',
    '#tandem',
];

const generateRandomHashtags = (): string[] => {
    const hashtagCount = Math.floor(Math.random() * 4) + 1; // 1-4 hashtags
    const selectedHashtags = new Set<string>();

    while (selectedHashtags.size < hashtagCount) {
        selectedHashtags.add(
            hashtags[Math.floor(Math.random() * hashtags.length)],
        );
    }

    return Array.from(selectedHashtags);
};

export const createSampleHashtags = async (
    prisma: PrismaClient,
): Promise<void> => {
    // Récupérer toutes les conversations existantes
    const conversations = await prisma.conversation.findMany();

    for (const conversation of conversations) {
        const conversationHashtags = generateRandomHashtags();

        for (const hashtagName of conversationHashtags) {
            await prisma.hashtag.create({
                data: {
                    name: hashtagName,
                    conversationId: conversation.id,
                },
            });
        }
    }
};

export const createBulkHashtags = async (
    prisma: PrismaClient,
    hashtagsPerConversation: number = 3,
): Promise<void> => {
    console.log(`🏷️ Création de hashtags pour toutes les conversations...`);

    // Récupérer toutes les conversations existantes
    const conversations = await prisma.conversation.findMany();

    for (const conversation of conversations) {
        const conversationHashtags = generateRandomHashtags();

        // Limiter le nombre de hashtags par conversation
        const selectedHashtags = conversationHashtags.slice(
            0,
            hashtagsPerConversation,
        );

        for (const hashtagName of selectedHashtags) {
            await prisma.hashtag.create({
                data: {
                    name: hashtagName,
                    conversationId: conversation.id,
                },
            });
        }
    }

    console.log(
        `✅ Hashtags créés pour ${conversations.length} conversations.`,
    );
};

export const createSpecificHashtags = async (
    prisma: PrismaClient,
): Promise<void> => {
    // Créer des hashtags spécifiques pour certaines conversations
    const conversations = await prisma.conversation.findMany({
        take: 10, // Limiter aux 10 premières conversations
    });

    const specificHashtagGroups = [
        ['#language-exchange', '#english', '#french'],
        ['#pronunciation', '#grammar', '#vocabulary'],
        ['#culture', '#travel', '#food'],
        ['#music', '#movies', '#books'],
        ['#technology', '#science', '#business'],
        ['#sports', '#art', '#history'],
        ['#multilingual', '#group-chat', '#tandem'],
        ['#education', '#learning', '#practice'],
        ['#friendship', '#community', '#support'],
        ['#fun', '#interesting', '#helpful'],
    ];

    for (let i = 0; i < conversations.length; i++) {
        const conversation = conversations[i];
        const hashtagGroup =
            specificHashtagGroups[i % specificHashtagGroups.length];

        for (const hashtagName of hashtagGroup) {
            await prisma.hashtag.create({
                data: {
                    name: hashtagName,
                    conversationId: conversation.id,
                },
            });
        }
    }

    console.log(
        `✅ Hashtags spécifiques créés pour ${conversations.length} conversations.`,
    );
};
