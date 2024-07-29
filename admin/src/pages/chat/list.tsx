import { Box, Drawer } from '@mui/material';
import React, { useState } from 'react';
import {
    DatagridConfigurable,
    FunctionField,
    List,
    Loading,
    minLength,
    SelectInput,
    TextInput,
    useGetIdentity,
    useGetList,
    useTranslate,
} from 'react-admin';
import CustomAvatar from '../../components/CustomAvatar';
import PageTitle from '../../components/PageTitle';
import { Conversation } from '../../entities/Conversation';
import MessagesList from '../chat-messages/list';

const ChatList = () => {
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const translate = useTranslate();
    const { data: universities } = useGetList('universities');

    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

    /*     const handleClose = useCallback(() => {
        setCurrentConversation(null);
    }, []); */

    if (isLoadingIdentity || !identity) return <Loading />;

    const filters = [
        <TextInput
            key="lastname"
            label={translate('chat.list.filters.lastname')}
            source="lastname"
            validate={[minLength(3)]}
        />,
        <TextInput
            key="firstname"
            label={translate('chat.list.filters.firstname')}
            source="firstname"
            validate={[minLength(3)]}
        />,
        <SelectInput
            key="university"
            choices={universities}
            label={translate('chat.list.filters.university')}
            source="university"
        />,
    ];

    return (
        <Box>
            <Box>
                <PageTitle>{translate('chat.title')}</PageTitle>
                <List
                    exporter={false}
                    filter={{
                        id: identity.id,
                    }}
                    filters={filters}
                    sx={{
                        flexGrow: 1,
                        transition: (theme: any) =>
                            theme.transitions.create(['all'], {
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        marginRight: currentConversation ? '700px' : 0,
                    }}
                >
                    <DatagridConfigurable
                        bulkActionButtons={false}
                        rowClick={(_, __, record) => {
                            setCurrentConversation(record as Conversation);

                            // Disable the default rowClick behavior
                            return false;
                        }}
                    >
                        <FunctionField
                            label=""
                            render={(record: Conversation) => (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CustomAvatar
                                            avatarId={record.partner.avatar?.id}
                                            firstName={record.partner.firstname}
                                            lastName={record.partner.lastname}
                                        />
                                        <Box>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '0' }}>
                                                {record.partner.lastname} {record.partner.firstname}
                                            </p>
                                            <p style={{ color: 'gray', margin: '0' }}>{record.lastMessage?.content}</p>
                                        </Box>
                                    </Box>
                                    {record.lastMessage && (
                                        <Box>
                                            <p>
                                                {new Date(record.lastMessage.createdAt).toLocaleDateString(undefined, {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                })}
                                            </p>
                                        </Box>
                                    )}
                                </Box>
                            )}
                            sortable={false}
                            source="code"
                        />
                    </DatagridConfigurable>
                </List>
            </Box>
            <Drawer
                anchor="right"
                // onClose={handleClose}
                open={!!currentConversation}
                sx={{ zIndex: 100 }}
                variant="persistent"
            >
                {currentConversation && <MessagesList conversation={currentConversation} />}
            </Drawer>
        </Box>
    );
};

export default ChatList;
