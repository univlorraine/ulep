import { Box } from '@mui/material';
import React from 'react';
import {
    Datagrid,
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

const ChatList = () => {
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const translate = useTranslate();
    const { data: universities } = useGetList('universities');

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
        <>
            <PageTitle>{translate('chat.title')}</PageTitle>
            <List
                exporter={false}
                filter={{
                    id: identity.id,
                }}
                filters={filters}
            >
                <Datagrid bulkActionButtons={false} rowClick="show">
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
                </Datagrid>
            </List>
        </>
    );
};

export default ChatList;
