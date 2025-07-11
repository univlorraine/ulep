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

const languages = ['fr', 'en', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'];

const sampleMessages = [
    // Français
    'Salut ! Comment ça va ?',
    'Très bien merci ! Et toi ?',
    "Parfait ! Tu veux qu'on pratique l'anglais ?",
    "Bien sûr ! Je peux t'aider.",
    'Merci beaucoup !',
    'De rien !',
    'Comment dit-on ça en français ?',
    'Peux-tu me corriger ?',
    "C'est très utile !",
    "J'apprends beaucoup !",

    // Anglais
    'Hello! How are you?',
    "I'm fine, thank you! And you?",
    'Great! Do you want to practice French?',
    'Of course! I can help you.',
    'Thank you very much!',
    "You're welcome!",
    'How do you say this in English?',
    'Can you correct me?',
    'This is very useful!',
    "I'm learning a lot!",

    // Espagnol
    '¡Hola! ¿Cómo estás?',
    '¡Muy bien, gracias! ¿Y tú?',
    '¡Perfecto! ¿Quieres practicar inglés?',
    '¡Por supuesto! Te puedo ayudar.',
    '¡Muchas gracias!',
    '¡De nada!',
    '¿Cómo se dice esto en español?',
    '¿Puedes corregirme?',
    '¡Esto es muy útil!',
    '¡Estoy aprendiendo mucho!',

    // Allemand
    'Hallo! Wie geht es dir?',
    'Gut, danke! Und dir?',
    'Perfekt! Möchtest du Französisch üben?',
    'Natürlich! Ich kann dir helfen.',
    'Vielen Dank!',
    'Gerne!',
    'Wie sagt man das auf Deutsch?',
    'Kannst du mich korrigieren?',
    'Das ist sehr nützlich!',
    'Ich lerne viel!',
];

const generateRandomId = (): string => {
    return `user${Math.floor(Math.random() * 10000)}`;
};

const generateRandomMessage = (ownerId: string): any => {
    const content =
        sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const language = languages[Math.floor(Math.random() * languages.length)];

    return {
        content,
        ownerId,
        type: 'text',
        metadata: {
            language,
            timestamp: new Date(Date.now() - Math.random() * 86400000),
        },
    };
};

export const createSampleMessages = async (
    prisma: PrismaClient,
): Promise<void> => {
    // Récupérer toutes les conversations existantes
    const conversations = await prisma.conversation.findMany();

    for (const conversation of conversations) {
        const participantIds = conversation.participantIds;
        const messageCount = Math.floor(Math.random() * 10) + 1; // 1-10 messages

        for (let i = 0; i < messageCount; i++) {
            const ownerId =
                participantIds[
                    Math.floor(Math.random() * participantIds.length)
                ];
            const message = generateRandomMessage(ownerId);

            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    content: message.content,
                    ownerId: message.ownerId,
                    type: 'text',
                    metadata: message.metadata,
                },
            });
        }
    }
};

export const createMessageWithReplies = async (
    prisma: PrismaClient,
): Promise<void> => {
    const conversation = await prisma.conversation.create({
        data: {
            participantIds: ['user10', 'user11'],
            lastActivityAt: new Date(),
            metadata: { type: 'discussion' },
        },
    });

    // Créer un message parent
    const parentMessage = await prisma.message.create({
        data: {
            conversationId: conversation.id,
            content:
                "Qu'est-ce que vous pensez de cette méthode d'apprentissage ?",
            ownerId: 'user10',
            type: 'text',
            metadata: { language: 'fr' },
        },
    });

    // Créer des réponses au message parent
    await prisma.message.create({
        data: {
            conversationId: conversation.id,
            parentId: parentMessage.id,
            content: "Je pense que c'est très efficace !",
            ownerId: 'user11',
            type: 'text',
            metadata: { language: 'fr' },
        },
    });

    await prisma.message.create({
        data: {
            conversationId: conversation.id,
            parentId: parentMessage.id,
            content: "Moi aussi, j'ai fait beaucoup de progrès",
            ownerId: 'user10',
            type: 'text',
            metadata: { language: 'fr' },
        },
    });
};

export const createMessageWithLikes = async (
    prisma: PrismaClient,
): Promise<void> => {
    const conversation = await prisma.conversation.create({
        data: {
            participantIds: ['user12', 'user13', 'user14'],
            lastActivityAt: new Date(),
            metadata: { type: 'group-learning' },
        },
    });

    // Créer un message qui sera liké
    const likedMessage = await prisma.message.create({
        data: {
            conversationId: conversation.id,
            content: 'Excellent travail ! Continuez comme ça !',
            ownerId: 'user12',
            type: 'text',
            metadata: { language: 'fr' },
        },
    });

    // Créer des likes pour ce message
    await prisma.messageLike.create({
        data: {
            messageId: likedMessage.id,
            userId: 'user13',
        },
    });

    await prisma.messageLike.create({
        data: {
            messageId: likedMessage.id,
            userId: 'user14',
        },
    });
};

export const createBulkMessages = async (
    prisma: PrismaClient,
    messagesPerConversation: number = 5,
): Promise<void> => {
    console.log(`💬 Création de messages pour toutes les conversations...`);

    // Récupérer toutes les conversations existantes
    const conversations = await prisma.conversation.findMany();

    for (const conversation of conversations) {
        const participantIds = conversation.participantIds;

        for (let i = 0; i < messagesPerConversation; i++) {
            const ownerId =
                participantIds[
                    Math.floor(Math.random() * participantIds.length)
                ];
            const message = generateRandomMessage(ownerId);

            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    content: message.content,
                    ownerId: message.ownerId,
                    type: 'text',
                    metadata: message.metadata,
                },
            });
        }

        // Ajouter quelques likes aléatoires (10% de chance par message)
        const messages = await prisma.message.findMany({
            where: { conversationId: conversation.id },
        });

        for (const message of messages) {
            if (Math.random() < 0.1) {
                // 10% de chance
                const likerId =
                    participantIds[
                        Math.floor(Math.random() * participantIds.length)
                    ];
                if (likerId !== message.ownerId) {
                    // Ne pas liker ses propres messages
                    try {
                        await prisma.messageLike.create({
                            data: {
                                messageId: message.id,
                                userId: likerId,
                            },
                        });
                    } catch (error) {
                        // Ignorer les erreurs de contrainte unique
                    }
                }
            }
        }

        // Ajouter quelques réponses aléatoires (5% de chance)
        for (const message of messages) {
            if (Math.random() < 0.05) {
                // 5% de chance
                const replierId =
                    participantIds[
                        Math.floor(Math.random() * participantIds.length)
                    ];
                const replyMessage = generateRandomMessage(replierId);

                await prisma.message.create({
                    data: {
                        conversationId: conversation.id,
                        parentId: message.id,
                        content: replyMessage.content,
                        ownerId: replyMessage.ownerId,
                        type: 'text',
                        metadata: replyMessage.metadata,
                    },
                });
            }
        }
    }

    console.log(
        `✅ Messages créés pour ${conversations.length} conversations.`,
    );
};
