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
} from 'react-admin';
import ColoredChips from '../../components/ColoredChips';
import PageTitle from '../../components/PageTitle';
import { Activity, ActivityStatus } from '../../entities/Activity';
import { ActivityThemeCategory } from '../../entities/ActivityThemeCategory';
import ProficiencyLevel from '../../entities/Proficiency';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';

type ActivityStatusChipsProps = {
    status: ActivityStatus;
};

const ActivityStatusChips = ({ status }: ActivityStatusChipsProps) => {
    const translate = useTranslate();

    if (status === ActivityStatus.DRAFT) {
        return <ColoredChips color="primary" label={translate(`activities.status.${status.toLowerCase()}`)} />;
    }

    if (status === ActivityStatus.IN_VALIDATION) {
        return <ColoredChips color="info" label={translate(`activities.status.${status.toLowerCase()}`)} />;
    }

    if (status === ActivityStatus.REJECTED) {
        return <ColoredChips color="error" label={translate(`activities.status.${status.toLowerCase()}`)} />;
    }

    if (status === ActivityStatus.PUBLISHED) {
        return <ColoredChips color="success" label={translate(`activities.status.${status.toLowerCase()}`)} />;
    }

    return null;
};

const ActivityList = () => {
    const translate = useTranslate();
    const { data: languages } = useGetList('languages', {
        pagination: {
            page: 1,
            perPage: 9999,
        },
    });
    const { data: categories } = useGetList('activities/categories', {
        pagination: {
            page: 1,
            perPage: 9999,
        },
    });

    console.log({ categories });

    const filters = categories
        ? [
              <TextInput key="title" label={translate('activities.list.title')} source="title" alwaysOn />,
              <AutocompleteInput
                  key="languageCode"
                  choices={languages?.map((language) => ({
                      id: language.id,
                      name: `${codeLanguageToFlag(language.code)}`,
                  }))}
                  label={translate('activities.list.language')}
                  source="languageCode"
                  alwaysOn
              />,
              <SelectInput
                  key="languageLevel"
                  choices={Object.values(ProficiencyLevel).map((level) => ({
                      id: level,
                      name: level,
                  }))}
                  label={translate('activities.list.level')}
                  source="languageLevel"
                  alwaysOn
              />,
              <SelectInput
                  key="category"
                  choices={categories?.map((category: ActivityThemeCategory) => ({
                      id: category.id,
                      name: category.content,
                  }))}
                  label={translate('activities.list.category')}
                  source="category"
                  alwaysOn
              />,
              <SelectInput
                  key="status"
                  choices={Object.values(ActivityStatus).map((status) => ({
                      id: status,
                      name: translate(`activities.status.${status.toLowerCase()}`),
                  }))}
                  label={translate('activities.list.status')}
                  source="status"
                  alwaysOn
              />,
          ]
        : [];

    return (
        <>
            <PageTitle>{translate('activities.label')}</PageTitle>
            <List exporter={false} filters={filters}>
                <Datagrid bulkActionButtons={false}>
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
                    <TextField
                        label={translate('activities.list.university')}
                        sortable={false}
                        source="university.name"
                    />
                    <FunctionField
                        label={translate('activities.list.creator')}
                        render={(record: Activity) => {
                            if (!record.creator) {
                                return 'Admin';
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
