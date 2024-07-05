import { useEffect, useRef, useState } from 'react';
import { Message } from '../../domain/entities/chat/Message';

interface UseMessagesProps {
    messages: Message[];
    isScrollOver: boolean;
    loadMessages: () => void;
}

export const useMessages = ({ messages, isScrollOver, loadMessages }: UseMessagesProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollPositionRef = useRef<number>(0);
    const previousScrollHeightRef = useRef<number>(0);
    let loadNewMessage = false;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const messagesContainer = messagesEndRef.current?.parentElement;
        if (messagesContainer) {
            if (isLoading) {
                const newScrollHeight = messagesContainer.scrollHeight;
                const heightDifference = newScrollHeight - previousScrollHeightRef.current;
                messagesContainer.scrollTop = scrollPositionRef.current + heightDifference;
                setIsLoading(false);
            } else if (messagesContainer.scrollHeight <= messagesContainer.clientHeight) {
                loadMessages();
            } else {
                scrollToBottom();
            }
        }
    }, [messages]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight } = event.currentTarget;

        if (!loadNewMessage && !isScrollOver && scrollTop === 0) {
            setIsLoading(true);
            scrollPositionRef.current = scrollTop;
            previousScrollHeightRef.current = scrollHeight;
            loadMessages();
        }
    };

    return { isLoading, messagesEndRef, handleScroll };
};
