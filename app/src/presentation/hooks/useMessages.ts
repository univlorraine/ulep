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

import { useEffect, useRef, useState } from 'react';
import { MessagePaginationDirection } from '../../domain/entities/chat/Conversation';
import { Message } from '../../domain/entities/chat/Message';

interface UseMessagesProps {
    messages: Message[];
    isScrollForwardOver: boolean;
    isScrollBackwardOver: boolean;
    isSearchMode: boolean;
    loadMessages: (direction: MessagePaginationDirection) => void;
}

export const useMessages = ({
    messages,
    isScrollForwardOver,
    isScrollBackwardOver,
    isSearchMode = false,
    loadMessages,
}: UseMessagesProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [direction, setDirection] = useState<MessagePaginationDirection>();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollPositionRef = useRef<number>(0);
    const previousScrollHeightRef = useRef<number>(0);

    const allImagesLoaded = async () =>
        Promise.all(
            Array.from(document.images)
                .filter((img) => !img.complete)
                .map(
                    (img) =>
                        new Promise((resolve) => {
                            img.onload = img.onerror = resolve;
                        })
                )
        );

    const scrollToMessageRef = async () => {
        await allImagesLoaded();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!messages.length) return;

        const messagesContainer = messagesEndRef.current?.parentElement;
        if (messagesContainer) {
            // If the user scrolls up, we need to move the scroll to the last message from previous pagination
            if (isLoading && direction === MessagePaginationDirection.FORWARD) {
                const newScrollHeight = messagesContainer.scrollHeight;
                const heightDifference = newScrollHeight - previousScrollHeightRef.current;
                messagesContainer.scrollTop = scrollPositionRef.current + heightDifference;
                setIsLoading(false);
                // If the user scrolls down, we need to stay at the same position
            } else if (isLoading && direction === MessagePaginationDirection.BACKWARD) {
                setIsLoading(false);
                return;
                // If there is less message displaying than the size screen, we need to load more
            } else if (!isScrollForwardOver && messagesContainer.scrollHeight <= messagesContainer.clientHeight) {
                loadMessages(MessagePaginationDirection.FORWARD);
                // Else its the first time we load the conversation, we need to go to the ref message ( search or last message )
            } else {
                scrollToMessageRef();
            }
        }
    }, [messages]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        if (messages.length === 0) return;

        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

        const handleForwardScroll = () => {
            setIsLoading(true);
            scrollPositionRef.current = scrollTop;
            previousScrollHeightRef.current = scrollHeight;
            setDirection(MessagePaginationDirection.FORWARD);
            loadMessages(MessagePaginationDirection.FORWARD);
        };

        const handleBackwardScroll = () => {
            setIsLoading(true);
            setDirection(MessagePaginationDirection.BACKWARD);
            loadMessages(MessagePaginationDirection.BACKWARD);
        };

        if (!isLoading && !isScrollForwardOver && scrollTop === 0) {
            handleForwardScroll();
        } else if (!isLoading && isSearchMode && !isScrollBackwardOver && scrollTop + clientHeight >= scrollHeight) {
            handleBackwardScroll();
        }
    };

    return { isLoading, messagesEndRef, handleScroll };
};
