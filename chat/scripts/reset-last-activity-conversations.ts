import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateConversationsWithoutMessages() {
    try {
        const conversationsWithoutMessages = await prisma.conversation.findMany(
            {
                where: {
                    Messages: {
                        none: {},
                    },
                },
            },
        );

        for (const conversation of conversationsWithoutMessages) {
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: { lastActivityAt: null },
            });
        }

        console.log(
            `Updated ${conversationsWithoutMessages.length} conversations.`,
        );
    } catch (error) {
        console.error('Error updating conversations:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateConversationsWithoutMessages();
