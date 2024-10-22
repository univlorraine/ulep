import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { List, Datagrid, useTranslate, TextField, useGetIdentity, Loading, useDataProvider } from 'react-admin';
import PageTitle from '../../../components/PageTitle';
import { EventObject } from '../../../entities/Event';

interface BulkActionButtonProps {
    eventId: string;
    selectedIds?: string[];
}

const BulkActionButton = ({ eventId, selectedIds }: BulkActionButtonProps) => {
    const { unsubscribeToEvent } = useDataProvider();

    const unsubscribe = async () => {
        await unsubscribeToEvent(eventId, selectedIds);
    };

    return <Button onClick={unsubscribe}>Unsubscribe</Button>;
};

const EventsSubscriptionsList = () => {
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { getOne } = useDataProvider();
    const [currentEvent, setCurrentEvent] = useState<EventObject>();

    const eventId = window.location.hash.split('/').slice(-1)[0];

    console.log({ currentEvent });

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
            <Typography variant="h3">
                {translate('events.subscriptions.title', { eventTitle: currentEvent?.title })}
            </Typography>
            <Typography variant="h4">
                {translate('events.subscriptions.author', {
                    universityName: currentEvent?.authorUniversity.name,
                })}
            </Typography>
            <List
                exporter={false}
                filter={{
                    eventId,
                }}
            >
                <Datagrid bulkActionButtons={<BulkActionButton eventId={eventId} />}>
                    <TextField label="events.subscriptions.list.firstname" source="user.firstname" />
                    <TextField label="events.subscriptions.list.lastname" source="user.lastname" />
                    <TextField label="events.subscriptions.list.university" source="user.university.name" />
                    <TextField label="events.subscriptions.list.email" source="user.email" />
                </Datagrid>
            </List>
        </>
    );
};

export default EventsSubscriptionsList;
