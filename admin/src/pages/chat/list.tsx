import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import {
    DatagridConfigurable,
    FunctionField,
    List,
    Loading,
    Pagination,
    TextInput,
    minLength,
    useGetIdentity,
    useLocaleState,
    useTranslate,
} from 'react-admin';
import ChatContent from '../../components/chat/ChatContent';
import CustomAvatar from '../../components/CustomAvatar';
import PageTitle from '../../components/PageTitle';
import { Conversation } from '../../entities/Conversation';
import { MessageType } from '../../entities/Message';
import getLocaleCode from '../../utils/getLocaleCode';

const ChatList = () => {
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const translate = useTranslate();
    const [locale] = useLocaleState();
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
                    pagination={<Pagination rowsPerPageOptions={[5]} />}
                    perPage={5}
                    sx={{
                        flexGrow: 1,
                        transition: (theme: any) =>
                            theme.transitions.create(['all'], {
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        marginRight: currentConversation ? '500px' : 0,
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
                            render={(record: Conversation) => {
                                let lastMessageInfo;

                                switch (record.lastMessage?.type) {
                                    case MessageType.Link:
                                    case MessageType.Text:
                                        lastMessageInfo = record.lastMessage.content;
                                        break;
                                    case MessageType.Image:
                                        lastMessageInfo = translate('chat.messageType.image');
                                        break;
                                    case MessageType.Audio:
                                        lastMessageInfo = translate('chat.messageType.audio');
                                        break;
                                    case MessageType.File:
                                        lastMessageInfo = translate('chat.messageType.file');
                                        break;
                                    default:
                                        lastMessageInfo = '';
                                        break;
                                }

                                return (
                                    <Box
                                        key={record.id}
                                        sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}
                                    >
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
                                                <p style={{ color: 'gray', margin: '0' }}>{lastMessageInfo}</p>
                                            </Box>
                                        </Box>
                                        {record.lastMessage && (
                                            <Box>
                                                {new Date(record.lastMessage.createdAt).toLocaleString(
                                                    getLocaleCode(locale),
                                                    {
                                                        dateStyle: 'long',
                                                        timeStyle: 'short',
                                                    }
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                );
                            }}
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
                {currentConversation && <ChatContent conversation={currentConversation} />}
            </Drawer>
        </Box>
    );
};

export default ChatList;
