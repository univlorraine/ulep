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
    Link,
} from 'react-admin';
import ColoredChips, { ChipsColors } from '../../components/ColoredChips';
import useGetUniversitiesLanguages from '../../components/form/useGetUniversitiesLanguages';
import PageTitle from '../../components/PageTitle';
import { EventObject, EventStatus, EventTranslation } from '../../entities/Event';
import { NewsStatus } from '../../entities/News';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';

const StatusChips = ({ status }: { status: string }) => {
    const translate = useTranslate();

    let color: ChipsColors = 'default';
    switch (status) {
        case EventStatus.DRAFT:
            color = 'default';
            break;
        case NewsStatus.READY:
            color = 'success';
            break;
    }

    return <ColoredChips color={color} label={translate(`events.status.${status}`)} />;
};

const EventsList = () => {
    const translate = useTranslate();
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
            key="statusFilter"
            choices={Object.values(NewsStatus).map((status) => ({
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
                filter={!identity?.isCentralUniversity ? { universityId: identity?.universityId } : undefined}
                filters={filters}
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
                        label="events.list.subscriptions"
                        render={(record: EventObject) => {
                            if (record.withSubscription) {
                                return (
                                    <Link to={`/events/subscriptions/${record.id}`}>
                                        {record.enrolledUsers?.length} inscrits
                                    </Link>
                                );
                            }

                            return null;
                        }}
                    />
                    <FunctionField
                        label="news.list.status"
                        render={(record: any) => <StatusChips status={record.status} />}
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default EventsList;
