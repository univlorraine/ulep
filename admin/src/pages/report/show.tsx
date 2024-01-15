import React from 'react';
import { TopToolbar, EditButton, useTranslate, Show, SimpleShowLayout, TextField, FunctionField } from 'react-admin';
import Report from '../../entities/Report';

const ReportShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const ReportShow = () => {
    const translate = useTranslate();

    return (
        <Show actions={<ReportShowAction />} title={translate('reports.label')}>
            <SimpleShowLayout sx={{ m: 3 }}>
                <TextField
                    emptyText={translate('global.deleted_user')}
                    label={translate('global.firstname')}
                    source="user.firstname"
                />
                <TextField
                    emptyText={translate('global.deleted_user')}
                    label={translate('global.lastname')}
                    source="user.lastname"
                />
                <TextField
                    emptyText={translate('global.deleted_user')}
                    label={translate('global.email')}
                    source="user.email"
                />
                <FunctionField
                    label={translate('reports.status')}
                    render={(record: Report) => translate(`reports.${record.status}`)}
                    source="status"
                />
                <TextField label={translate('reports.category')} source="category.name" />
                <TextField label={translate('global.content')} source="content" />
                <TextField label={translate('reports.comment')} source="comment" />
            </SimpleShowLayout>
        </Show>
    );
};

export default ReportShow;
