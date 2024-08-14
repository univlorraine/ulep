import { Box, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Loading, useDataProvider, useGetIdentity, useTranslate } from 'react-admin';
import { Conversation } from '../../entities/Conversation';
import SocketIoProvider from '../../providers/socketIoProvider';
import ChatInputSender from './ChatInputSender';
import MessagesList from './MessagesList';
import useHandleMessagesFromConversation from './useHandleMessagesFromConversation';

interface ChatContentProps {
    conversation: Conversation;
}

const ChatContent = ({ conversation }: ChatContentProps) => {
    const translate = useTranslate();
    // const { isBlocked } = conversation;
    // const [showMenu, setShowMenu] = useState(false);
    // const [currentMessageSearchId, setCurrentMessageSearchId] = useState<string>();
    // const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
    const user = useGetIdentity();
    const dataProvider = useDataProvider();
    const [socketIoProvider, setSocketIoProvider] = useState<SocketIoProvider | null>(null);
    console.log({ conversation });

    const {
        messages,
        isScrollForwardOver,
        isScrollBackwardOver,
        isLoading,
        loadMessages,
        addNewMessage,
        // clearMessages,
    } = useHandleMessagesFromConversation({
        conversationId: conversation.id,
    });

    // const setSearchMode = () => {
    //     setShowMenu(false);
    //     setIsSearchMode(true);
    // };

    // const unsetSearchMode = () => {
    //     setIsSearchMode(false);
    //     setCurrentMessageSearchId(undefined);
    // };

    // const loadMessageFromSearch = (messageId: string) => {
    //     setCurrentMessageSearchId(messageId);
    //     loadMessages(true, MessagePaginationDirection.BOTH, messageId);
    // };

    useEffect(() => {
        socketIoProvider?.connect();
        socketIoProvider?.onMessage(conversation.id, addNewMessage);

        return () => {
            socketIoProvider?.disconnect();
            socketIoProvider?.offMessage();
        };
    }, [conversation.id, socketIoProvider]);

    useEffect(() => {
        const loadSocketIoProvider = async () => {
            setSocketIoProvider(await dataProvider.getSocketIoProvider());
        };

        loadSocketIoProvider();
    }, []);

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '500px',
                height: '100%',
                marginTop: '56px',
                overflow: 'hidden',
                padding: ['0', '0', '0'],
            }}
        >
            <Typography flex="1" sx={{ lineHeight: 3, paddingLeft: 2, borderBottom: '1px solid #E0E0E0' }} variant="h6">
                {translate('chat.show.title', {
                    partner: `${conversation?.partner?.lastname} ${conversation?.partner?.firstname}`,
                })}
            </Typography>
            {isLoading ? (
                <Loading />
            ) : (
                <MessagesList
                    currentMessageSearchId={undefined}
                    isScrollBackwardOver={isScrollBackwardOver}
                    isScrollForwardOver={isScrollForwardOver}
                    loadMessages={(direction) => loadMessages({ isFirstMessage: false, direction })}
                    messages={messages}
                    userId={user.identity?.id as string}
                />
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #E0E0E0' }}>
                <ChatInputSender />
            </Box>
        </Container>
    );
};

export default ChatContent;
