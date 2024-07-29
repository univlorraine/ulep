import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { InfiniteListBase, InfinitePagination, useTranslate, WithListContext } from 'react-admin';
import { Conversation } from '../../entities/Conversation';

interface MessagesListProps {
    // id: string;
    conversation: Conversation;
    // onClose: () => void;
}

const MessagesList = ({ conversation }: MessagesListProps) => {
    console.log({ conversation });
    const translate = useTranslate();

    return (
        <InfiniteListBase filter={{ conversationId: conversation?.id }} perPage={10} resource="chat/messages">
            <Container sx={{ width: '700px', marginTop: '8px', paddingTop: '56px' }}>
                <Typography flex="1" variant="h6">
                    {translate('chat.show.title', {
                        partner: `${conversation?.partner?.firstname} ${conversation?.partner?.lastname}`,
                    })}{' '}
                    TEST
                </Typography>
                <WithListContext
                    render={({ data }) => {
                        console.log({ data });

                        return (
                            <Box>
                                {data?.map((message) => <Typography key={message.id}>{message.content}</Typography>)}
                            </Box>
                        );
                    }}
                />
                <InfinitePagination />
            </Container>
        </InfiniteListBase>
    );
};

export default MessagesList;
