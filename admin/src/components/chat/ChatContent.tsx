import { VideoCall } from '@mui/icons-material';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Loading, useDataProvider, useGetIdentity, useRedirect, useTranslate } from 'react-admin';
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
    const user = useGetIdentity();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const [socketIoProvider, setSocketIoProvider] = useState<SocketIoProvider | undefined>();

    const { messages, isScrollForwardOver, isScrollBackwardOver, isLoading, loadMessages, addNewMessage } =
        useHandleMessagesFromConversation({
            conversationId: conversation.id,
        });

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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    lineHeight: 3,
                    paddingLeft: 2,
                    paddingRight: 2,
                    borderBottom: '1px solid #E0E0E0',
                }}
            >
                <Typography variant="h6">
                    {translate('chat.show.title', {
                        partner: `${conversation?.partner?.lastname} ${conversation?.partner?.firstname}`,
                    })}
                </Typography>
                <IconButton onClick={() => redirect(`/jitsi?roomName=${conversation.id}`)}>
                    <VideoCall />
                </IconButton>
            </Box>

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
                <ChatInputSender
                    conversation={conversation}
                    profile={user.identity as UserIdentity}
                    socketIoProvider={socketIoProvider}
                />
            </Box>
        </Container>
    );
};

export default ChatContent;
