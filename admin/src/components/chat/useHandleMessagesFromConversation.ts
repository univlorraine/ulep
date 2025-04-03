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

import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import { Message, MessagePaginationDirection, MessageType } from '../../entities/Message';

interface UseHandleMessagesFromConversationProps {
    conversationId: string;
    typeFilter?: MessageType;
    limit?: number;
}

interface LoadMessagesProps {
    messageId?: string;
    direction?: MessagePaginationDirection;
    isFirstMessage?: boolean;
}

function useHandleMessagesFromConversation({
    conversationId,
    typeFilter,
    limit = 10,
}: UseHandleMessagesFromConversationProps) {
    const dataProvider = useDataProvider();
    const [lastMessageForwardId, setLastMessageForwardId] = useState<string>();
    const [lastMessageBackwardId, setLastMessageBackwardId] = useState<string>();

    const [messagesResult, setMessagesResult] = useState<{
        messages: Message[];
        isScrollForwardOver: boolean;
        isScrollBackwardOver: boolean;
        error: Error | undefined;
        isLoading: boolean;
    }>({
        messages: [],
        isScrollForwardOver: false,
        isScrollBackwardOver: false,
        error: undefined,
        isLoading: false,
    });

    const addNewMessage = (message: Message) => {
        setMessagesResult((current) => ({
            messages: [message, ...current.messages],
            isScrollForwardOver: current.isScrollForwardOver,
            isScrollBackwardOver: current.isScrollBackwardOver,
            error: undefined,
            isLoading: false,
        }));
    };

    const loadMessages = async ({
        messageId,
        direction = MessagePaginationDirection.FORWARD,
        isFirstMessage = false,
    }: LoadMessagesProps) => {
        if (
            (!isFirstMessage &&
                direction === MessagePaginationDirection.FORWARD &&
                messagesResult.isScrollForwardOver) ||
            (direction === MessagePaginationDirection.BACKWARD && messagesResult.isScrollBackwardOver)
        )
            return;

        setMessagesResult({
            ...messagesResult,
            isLoading: isFirstMessage, // Reload conversation only if it's the first message
        });

        let lastMessageId;
        // If we are in search mode
        if (isFirstMessage && messageId) {
            lastMessageId = messageId;
            // If we are in normal mode with forward and backward
        } else if (!isFirstMessage && !messageId) {
            lastMessageId =
                direction === MessagePaginationDirection.FORWARD ? lastMessageForwardId : lastMessageBackwardId;
        }

        const messagesConversationResult = await dataProvider.getChatMessagesByConversationId({
            conversationId,
            lastMessageId,
            limit,
            typeFilter,
            direction,
        });

        if (messagesConversationResult instanceof Error) {
            setMessagesResult({
                messages: [],
                error: messagesConversationResult,
                isLoading: false,
                isScrollForwardOver: false,
                isScrollBackwardOver: false,
            });
        }

        if (messagesConversationResult.length > 0) {
            if (direction === MessagePaginationDirection.FORWARD) {
                setLastMessageForwardId(messagesConversationResult[messagesConversationResult.length - 1].id);
            } else if (direction === MessagePaginationDirection.BACKWARD) {
                setLastMessageBackwardId(messagesConversationResult[0].id);
            } else {
                setLastMessageForwardId(messagesConversationResult[messagesConversationResult.length - 1].id);
                setLastMessageBackwardId(messagesConversationResult[0].id);
            }
        }

        if (direction === MessagePaginationDirection.BACKWARD) {
            setMessagesResult({
                messages: isFirstMessage
                    ? messagesConversationResult
                    : [...messagesConversationResult, ...messagesResult.messages],
                error: undefined,
                isLoading: false,
                isScrollBackwardOver: messagesConversationResult.length < limit,
                isScrollForwardOver: false,
            });
        } else if (direction === MessagePaginationDirection.FORWARD) {
            setMessagesResult({
                messages: isFirstMessage
                    ? messagesConversationResult
                    : [...messagesResult.messages, ...messagesConversationResult],
                error: undefined,
                isLoading: false,
                isScrollForwardOver: messagesConversationResult.length < limit,
                isScrollBackwardOver: false,
            });
        } else if (direction === MessagePaginationDirection.BOTH) {
            // Info: isScrollForwardOver and isScrollBackwardOver are set to false because we are loading messages from both directions
            // Info: we cannot know if we are before the limit of messages on forward or backward, so we set to false
            setMessagesResult({
                messages: messagesConversationResult,
                error: undefined,
                isLoading: false,
                isScrollForwardOver: false,
                isScrollBackwardOver: false,
            });
        }
    };

    const clearMessages = () => {
        setLastMessageForwardId(undefined);
        setLastMessageBackwardId(undefined);
        setMessagesResult({
            messages: [],
            error: undefined,
            isLoading: false,
            isScrollForwardOver: false,
            isScrollBackwardOver: false,
        });
    };

    useEffect(() => {
        loadMessages({ isFirstMessage: true });
    }, [conversationId, typeFilter]);

    return { ...messagesResult, loadMessages, addNewMessage, clearMessages };
}

export default useHandleMessagesFromConversation;
