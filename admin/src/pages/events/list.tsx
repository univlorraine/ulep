import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import { Box } from '@mui/material';
import React from 'react';
import {
    List,
    Datagrid,
    useTranslate,
    TextField,
    FunctionField,
    useGetIdentity,
    Loading,
    DateField,
    TextInput,
    SelectInput,
    useGetList,
    Button,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import ColoredChips, { ChipsColors } from '../../components/ColoredChips';
import useGetUniversitiesLanguages from '../../components/form/useGetUniversitiesLanguages';
import PageTitle from '../../components/PageTitle';
import { EventObject, EventStatus, EventTranslation, EventType } from '../../entities/Event';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';

const StatusChips = ({ status }: { status: string }) => {
    const translate = useTranslate();

    let color: ChipsColors = 'default';
    switch (status) {
        case EventStatus.DRAFT:
            color = 'default';
            break;
        case EventStatus.READY:
            color = 'success';
            break;
    }

    return <ColoredChips color={color} label={translate(`events.status.${status}`)} />;
};

const EventsList = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { data: universities } = useGetList('universities');
    const universitiesLanguages = useGetUniversitiesLanguages();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    const filters = [
        <TextInput key="titleFilter" label={translate('events.list.filters.title')} source="title" alwaysOn />,
        <SelectInput
            key="defaultLanguageFilter"
            choices={universitiesLanguages.map((language) => ({
                id: language,
                name: codeLanguageToFlag(language),
            }))}
            label={translate('events.list.filters.language')}
            source="languageCode"
            alwaysOn
        />,
        <SelectInput
            key="typeFilter"
            choices={Object.values(EventType).map((type) => ({
                id: type,
                name: translate(`events.type.${type}`),
            }))}
            label={translate('events.list.filters.type')}
            source="type"
            alwaysOn
        />,
        <SelectInput
            key="statusFilter"
            choices={Object.values(EventStatus).map((status) => ({
                id: status,
                name: translate(`events.status.${status}`),
            }))}
            label={translate('events.list.filters.status')}
            source="status"
            alwaysOn
        />,
    ];

    if (identity?.isCentralUniversity && universities) {
        filters.unshift(
            <SelectInput
                key="groupFilter"
                choices={universities}
                label={translate('events.list.filters.university')}
                source="authorUniversityId"
                alwaysOn
            />
        );
    }

    return (
        <>
            <PageTitle>{translate('events.title')}</PageTitle>
            <List
                exporter={false}
                filter={!identity?.isCentralUniversity ? { authorUniversityId: identity?.universityId } : undefined}
                filters={filters}
                disableSyncWithLocation
            >
                <Datagrid>
                    <TextField label="events.list.title" source="title" />
                    {identity?.isCentralUniversity && (
                        <TextField label="events.list.university" source="authorUniversity.name" />
                    )}

                    <FunctionField
                        label="events.list.defaultLanguage"
                        render={(record: EventObject) => codeLanguageToFlag(record.languageCode)}
                    />
                    <FunctionField
                        label="events.list.translations"
                        render={(record: EventObject) =>
                            record.translations
                                ?.map((translation: EventTranslation) => codeLanguageToFlag(translation.languageCode))
                                .join(', ')
                        }
                    />
                    <DateField label="events.list.startDate" source="startDate" />
                    <DateField label="events.list.endDate" source="endDate" />
                    <FunctionField
                        label="events.list.type"
                        render={(record: EventObject) => translate(`events.type.${record.type}`)}
                    />
                    <FunctionField
                        label="news.list.status"
                        render={(record: EventObject) => <StatusChips status={record.status} />}
                    />
                    <FunctionField
                        label="events.subscriptions.list.cta"
                        render={(record: EventObject) => (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    onClick={() => navigate(`/events/${record.id}`)}
                                    sx={{ '& span': { margin: 0 } }}
                                    variant="outlined"
                                >
                                    <EditIcon />
                                </Button>
                                {record.withSubscription && (
                                    <Button
                                        onClick={() => navigate(`/events/subscriptions/${record.id}`)}
                                        sx={{ '& span': { margin: 0 } }}
                                        variant="outlined"
                                    >
                                        <PeopleIcon />
                                    </Button>
                                )}
                            </Box>
                        )}
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default EventsList;
