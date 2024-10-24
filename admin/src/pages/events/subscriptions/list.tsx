import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';
import { EventObject } from '../../../entities/Event';
import SearchProfile from './SearchProfile';

interface BulkActionButtonProps {
    eventId: string;
    selectedIds?: string[];
    resource?: string;
}

const BulkActionButton = ({ eventId, resource, selectedIds }: BulkActionButtonProps) => {
    const { unsubscribeToEvent } = useDataProvider();
    const refresh = useRefresh();
    const unselectAll = useUnselectAll(resource ?? 'events/subscriptions');

    const unsubscribe = async () => {
        await unsubscribeToEvent(eventId, selectedIds);
        unselectAll();
        refresh();
    };

    return <Button onClick={unsubscribe}>Unsubscribe</Button>;
};

const EventsSubscriptionsList = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { getOne } = useDataProvider();
    const [currentEvent, setCurrentEvent] = useState<EventObject>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const eventId = window.location.hash.split('/').slice(-1)[0].split('?')[0];

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
                <Button
                    onClick={() => setIsModalOpen(true)}
                    sx={{ width: 'fit-content', alignSelf: 'center' }}
                    variant="contained"
                >
                    {translate('events.subscriptions.search.button')}
                </Button>
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
                        eventId,
                    }}
                >
                    <Datagrid
                        bulkActionButtons={<BulkActionButton eventId={eventId} />}
                        rowClick={(_, __, record) => {
                            navigate(`/profiles/${record.id}/show`);

                            // Disable the default rowClick behavior
                            return false;
                        }}
                    >
                        <TextField label="events.subscriptions.list.firstname" source="user.firstname" />
                        <TextField label="events.subscriptions.list.lastname" source="user.lastname" />
                        <TextField label="events.subscriptions.list.university" source="user.university.name" />
                        <TextField label="events.subscriptions.list.email" source="user.email" />
                    </Datagrid>
                </List>
            )}

            <Modal onClose={() => setIsModalOpen(false)} open={isModalOpen}>
                <SearchProfile eventId={eventId} setIsModalOpen={setIsModalOpen} />
            </Modal>
        </>
    );
};

export default EventsSubscriptionsList;
