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
            } else if (messagesContainer.scrollHeight <= messagesContainer.clientHeight) {
                loadMessages(MessagePaginationDirection.FORWARD);
                // If its the firs
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
