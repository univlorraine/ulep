import React from 'react';
import {
    useTranslate,
    List,
    Datagrid,
    TextField,
    FunctionField,
    TextInput,
    AutocompleteInput,
    useGetList,
    SelectInput,
    useGetIdentity,
    Loading,
    Filter,
    useRefresh,
} from 'react-admin';
import ActivityStatusChips from '../../components/ActivityStatusChipsProps';
import PageTitle from '../../components/PageTitle';
import { Activity, ActivityStatus } from '../../entities/Activity';
import { ActivityThemeCategory } from '../../entities/ActivityThemeCategory';
import ProficiencyLevel from '../../entities/Proficiency';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';

const Filters = (props: any) => {
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { data: universities } = useGetList('universities');
    const { data: languages } = useGetList('languages', {
        pagination: {
            page: 1,
            perPage: 9999,
        },
    });
    const { data: categories } = useGetList('activities/categories');

    if (isLoadingIdentity || !identity || !categories || !universities || !languages) {
        return <Loading />;
    }

    return (
        <Filter {...props}>
            {identity?.isCentralUniversity && universities && (
                <SelectInput
                    key="university"
                    choices={universities}
                    label={translate('activities.list.university')}
                    source="university"
                    alwaysOn
                />
            )}
            <TextInput key="title" label={translate('activities.list.title')} source="title" alwaysOn />
            <AutocompleteInput
                key="languageCode"
                choices={languages?.map((language) => ({
                    id: language.id,
                    name: `${codeLanguageToFlag(language.code)}`,
                }))}
                label={translate('activities.list.language')}
                source="languageCode"
                alwaysOn
            />
            <SelectInput
                key="languageLevel"
                choices={Object.values(ProficiencyLevel).map((level) => ({
                    id: level,
                    name: level,
                }))}
                label={translate('activities.list.level')}
                source="languageLevel"
                alwaysOn
            />
            <SelectInput
                key="category"
                choices={categories?.map((category: ActivityThemeCategory) => ({
                    id: category.id,
                    name: category.content,
                }))}
                label={translate('activities.list.category')}
                source="category"
                alwaysOn
            />
            <SelectInput
                key="status"
                choices={Object.values(ActivityStatus).map((status) => ({
                    id: status,
                    name: translate(`activities.status.${status.toLowerCase()}`),
                }))}
                label={translate('activities.list.status')}
                source="status"
                alwaysOn
            />
        </Filter>
    );
};

const ActivityList = () => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle>{translate('activities.label')}</PageTitle>
            <List
                exporter={false}
                filter={!identity?.isCentralUniversity ? { university: identity.universityId } : undefined}
                filters={<Filters useRefresh={refresh} />}
            >
                <Datagrid rowClick="show">
                    <FunctionField
                        label={translate('activities.list.language')}
                        render={(record: any) => <span>{codeLanguageToFlag(record.language.code)}</span>}
                        sortable={false}
                        source="language"
                    />
                    <TextField label={translate('activities.list.level')} sortable={false} source="languageLevel" />
                    <TextField
                        label={translate('activities.list.category')}
                        sortable={false}
                        source="theme.category.content"
                    />
                    <TextField label={translate('activities.list.theme')} sortable={false} source="theme.content" />
                    {identity?.isCentralUniversity && (
                        <TextField
                            label={translate('activities.list.university')}
                            sortable={false}
                            source="university.name"
                        />
                    )}
                    <FunctionField
                        label={translate('activities.list.creator')}
                        render={(record: Activity) => {
                            if (!record.creator) {
                                return translate('activities.list.admin');
                            }

                            return `${record.creator.user.firstname} ${record.creator.user.lastname}`;
                        }}
                        sortable={false}
                    />
                    <TextField label={translate('activities.list.title')} sortable={false} source="title" />
                    <FunctionField
                        label={translate('activities.list.status')}
                        render={(record: any) => <ActivityStatusChips status={record.status} />}
                        sortable={false}
                        source="language"
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default ActivityList;
