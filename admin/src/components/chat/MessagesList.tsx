import { Box } from '@mui/material';

import { Loading } from 'react-admin';
import { Message, MessagePaginationDirection } from '../../entities/Message';
import MessageComponent from './MessageComponent';
import useMessages from './useMessages';

interface MessagesListProps {
    currentMessageSearchId?: string;
    messages: Message[];
    isScrollForwardOver: boolean;
    isScrollBackwardOver: boolean;
    loadMessages: (direction: MessagePaginationDirection) => void;
    userId: string;
}

const MessagesList = ({
    currentMessageSearchId,
    messages,
    isScrollForwardOver,
    isScrollBackwardOver,
    loadMessages,
    userId,
}: MessagesListProps) => {
    // const translate = useTranslate();
    const { isLoading, messagesEndRef, handleScroll } = useMessages({
        messages,
        isScrollForwardOver,
        isScrollBackwardOver,
        isSearchMode: Boolean(currentMessageSearchId),
        loadMessages,
    });

    return (
        <Box
            onScroll={handleScroll}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                height: '100%',
                paddingLeft: 1,
                paddingRight: 1,
            }}
        >
            {isLoading && <Loading />}
            {messages &&
                [...messages]
                    .reverse()
                    .map((message) => <MessageComponent key={message.id} message={message} userId={userId} />)}
            <div key="chat-bottom" ref={messagesEndRef} />
        </Box>
    );
};

export default MessagesList;
