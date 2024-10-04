import React from 'react';
import { useTranslate, List, Datagrid, TextField, FunctionField } from 'react-admin';
import PageTitle from '../../components/PageTitle';
import { Activity } from '../../entities/Activity';

const ActivityList = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('activities.label')}</PageTitle>
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <TextField label={translate('activities.list.language')} sortable={false} source="language.code" />
                    <TextField label={translate('activities.list.level')} sortable={false} source="languageLevel" />
                    <TextField label={translate('activities.list.theme')} sortable={false} source="theme.content" />
                    <TextField
                        label={translate('activities.list.university')}
                        sortable={false}
                        source="university.name"
                    />
                    <FunctionField
                        label={translate('global.creator')}
                        render={(record: Activity) => {
                            if (!record.creator) {
                                return 'Admin';
                            }

                            return `${record.creator.user.firstname} ${record.creator.user.lastname}`;
                        }}
                        sortable={false}
                    />
                    <TextField label={translate('activities.list.title')} sortable={false} source="title" />
                    <TextField label={translate('activities.list.status')} sortable={false} source="status" />
                </Datagrid>
            </List>
        </>
    );
};

export default ActivityList;
