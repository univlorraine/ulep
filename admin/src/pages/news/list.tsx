import React from 'react';
import {
    List,
    Datagrid,
    useTranslate,
    TextField,
    FunctionField,
    useGetIdentity,
    Loading,
    SelectInput,
    useGetList,
    TextInput,
    DateField,
    usePermissions,
} from 'react-admin';
import ColoredChips, { ChipsColors } from '../../components/ColoredChips';
import useGetUniversitiesLanguages from '../../components/form/useGetUniversitiesLanguages';
import PageTitle from '../../components/PageTitle';
import { Role } from '../../entities/Administrator';
import { News, NewsStatus, NewsTranslation } from '../../entities/News';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';

const StatusChips = ({ status }: { status: string }) => {
    const translate = useTranslate();

    let color: ChipsColors = 'default';
    switch (status) {
        case NewsStatus.DRAFT:
            color = 'default';
            break;
        case NewsStatus.READY:
            color = 'success';
            break;
    }

    return <ColoredChips color={color} label={translate(`news.status.${status}`)} />;
};

const NewsList = () => {
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { data: universities } = useGetList('universities');
    const universitiesLanguages = useGetUniversitiesLanguages();

    const filters = [
        <TextInput key="titleFilter" label={translate('news.list.filters.title')} source="title" alwaysOn />,
        <SelectInput
            key="defaultLanguageFilter"
            choices={universitiesLanguages.map((language) => ({
                id: language,
                name: codeLanguageToFlag(language),
            }))}
            label={translate('news.list.filters.language')}
            source="languageCode"
            alwaysOn
        />,
        <SelectInput
            key="statusFilter"
            choices={Object.values(NewsStatus).map((status) => ({
                id: status,
                name: translate(`news.status.${status}`),
            }))}
            label={translate('news.list.filters.status')}
            source="status"
            alwaysOn
        />,
    ];

    if (identity?.isCentralUniversity && universities) {
        filters.unshift(
            <SelectInput
                key="groupFilter"
                choices={universities}
                label={translate('news.list.filters.university')}
                source="universityId"
                alwaysOn
            />
        );
    }

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle>{translate('news.title')}</PageTitle>
            <List
                exporter={false}
                filter={
                    !identity?.isCentralUniversity || !permissions.checkRole(Role.SUPER_ADMIN)
                        ? { universityId: identity?.universityId }
                        : undefined
                }
                filters={filters}
            >
                <Datagrid rowClick="edit">
                    <TextField label="news.list.title" source="title" />
                    {identity?.isCentralUniversity && (
                        <TextField label="news.list.university" source="university.name" />
                    )}
                    <FunctionField
                        label="news.list.defaultLanguage"
                        render={(record: News) => codeLanguageToFlag(record.languageCode)}
                    />
                    <FunctionField
                        label="news.list.translations"
                        render={(record: News) =>
                            record.translations
                                ?.map((translation: NewsTranslation) => codeLanguageToFlag(translation.languageCode))
                                .join(', ')
                        }
                    />
                    <DateField label="news.list.startPublicationDate" source="startPublicationDate" />
                    <DateField label="news.list.endPublicationDate" source="endPublicationDate" />
                    <FunctionField
                        label="news.list.status"
                        render={(record: any) => <StatusChips status={record.status} />}
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default NewsList;
