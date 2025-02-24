import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import {
    List,
    Datagrid,
    useTranslate,
    TextField,
    useGetIdentity,
    Loading,
    useDataProvider,
    useRefresh,
    useUnselectAll,
    SelectInput,
    TextInput,
    ReferenceInput,
    FunctionField,
    useGetList,
} from 'react-admin';
import PageTitle from '../../../components/PageTitle';
import { EventObject } from '../../../entities/Event';
import { Profile } from '../../../entities/Profile';
import { UserRole } from '../../../entities/User';
import SearchProfile from './SearchProfile';
import SendEmail from './SendEmail';

interface BulkActionButtonProps {
    eventId: string;
    selectedIds?: string[];
    resource?: string;
}

const BulkActionButton = ({ eventId, resource, selectedIds }: BulkActionButtonProps) => {
    const translate = useTranslate();
    const { unsubscribeToEvent } = useDataProvider();
    const refresh = useRefresh();
    const unselectAll = useUnselectAll(resource ?? 'events/subscriptions');

    const unsubscribe = async () => {
        await unsubscribeToEvent(eventId, selectedIds);
        unselectAll();
        refresh();
    };

    return <Button onClick={unsubscribe}>{translate('events.subscriptions.unsubscribe')}</Button>;
};

const EventsSubscriptionsList = () => {
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { getOne } = useDataProvider();
    const [currentEvent, setCurrentEvent] = useState<EventObject>();
    const [isSubscriptionsModalOpen, setIsSubscriptionsModalOpen] = useState<boolean>(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

    const { data: languages } = useGetList('languages', {
        pagination: { page: 1, perPage: 250 },
        sort: { field: 'name', order: 'ASC' },
    });

    const sortedLanguages = useMemo(() => {
        if (!languages) return [];

        return languages.sort((a, b) => {
            const nameA = translate(`languages_code.${a.code}`);
            const nameB = translate(`languages_code.${b.code}`);

            return nameA.localeCompare(nameB);
        });
    }, [languages]);

    const eventId = window.location.hash.split('/').slice(-1)[0].split('?')[0];

    const filters = [
        <SelectInput
            key="role"
            choices={Object.values(UserRole).map((role) => ({
                id: role,
                name: translate(`global.${role.toLowerCase()}`),
            }))}
            label={translate('global.role')}
            source="user.role"
            alwaysOn
        />,
        <TextInput key="firstname" label={translate('global.firstname')} source="user.firstname" alwaysOn />,
        <TextInput key="lastname" label={translate('global.lastname')} source="user.lastname" alwaysOn />,
        <TextInput key="email" label={translate('global.email')} source="user.email" alwaysOn />,
    ];

    if (sortedLanguages) {
        filters.push(
            <SelectInput
                choices={sortedLanguages}
                label={translate('profiles.native_language')}
                optionText={(option) => translate(`languages_code.${option.code}`)}
                optionValue="code"
                source="nativeLanguageCode"
                alwaysOn
            />
        );

        filters.push(
            <SelectInput
                choices={sortedLanguages}
                label={translate('profiles.mastered_languages')}
                optionText={(option) => translate(`languages_code.${option.code}`)}
                optionValue="code"
                source="masteredLanguageCode"
                alwaysOn
            />
        );
    }

    if (identity?.isCentralUniversity) {
        filters.push(
            <ReferenceInput
                key="university"
                label={translate('global.university')}
                reference="universities"
                sort={{ field: 'name', order: 'ASC' }}
                source="user.university"
                alwaysOn
            >
                <SelectInput label={translate('global.university')} optionText="name" optionValue="id" />
            </ReferenceInput>
        );
    }

    useEffect(() => {
        const fetchEvent = async () => {
            const event = await getOne('events', { id: eventId });
            setCurrentEvent(event.data);
        };

        fetchEvent();
    }, []);

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle>{translate('events.title')}</PageTitle>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h3">
                    {translate('events.subscriptions.title', { eventTitle: currentEvent?.title })}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <Button
                        onClick={() => setIsSubscriptionsModalOpen(true)}
                        sx={{ width: 'fit-content', alignSelf: 'center' }}
                        variant="contained"
                    >
                        {translate('events.subscriptions.search.button')}
                    </Button>
                    <Button
                        onClick={() => setIsEmailModalOpen(true)}
                        sx={{ width: 'fit-content', alignSelf: 'center' }}
                        variant="contained"
                    >
                        {translate('events.subscriptions.email.button')}
                    </Button>
                </Box>
            </Box>
            <Typography variant="h4">
                {translate('events.subscriptions.author', {
                    universityName: currentEvent?.authorUniversity.name,
                })}
            </Typography>
            {eventId && (
                <List
                    exporter={false}
                    filter={{
                        subscribedToEvent: eventId,
                    }}
                    filters={filters}
                >
                    <Datagrid
                        bulkActionButtons={<BulkActionButton eventId={eventId} />}
                        rowClick={(_, __, record) => {
                            window.open(`/#/profiles/${record.id}/show`, '_blank');

                            // Disable the default rowClick behavior
                            return false;
                        }}
                    >
                        <FunctionField
                            label={translate('global.role')}
                            render={(record: Profile) => translate(`global.${record.user.role.toLowerCase()}`)}
                            source="user.role"
                        />
                        <TextField label="events.subscriptions.list.firstname" source="user.firstname" />
                        <TextField label="events.subscriptions.list.lastname" source="user.lastname" />
                        <TextField label="events.subscriptions.list.university" source="user.university.name" />
                        <TextField label="events.subscriptions.list.email" source="user.email" />
                    </Datagrid>
                </List>
            )}

            <Modal onClose={() => setIsSubscriptionsModalOpen(false)} open={isSubscriptionsModalOpen}>
                <SearchProfile eventId={eventId} setIsModalOpen={setIsSubscriptionsModalOpen} />
            </Modal>

            <Modal onClose={() => setIsEmailModalOpen(false)} open={isEmailModalOpen}>
                <SendEmail eventId={eventId} setIsModalOpen={setIsEmailModalOpen} />
            </Modal>
        </>
    );
};

export default EventsSubscriptionsList;
