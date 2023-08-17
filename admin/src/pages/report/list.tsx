import React from 'react';
import { FunctionField } from 'react-admin';
import { useTranslate, Filter, SelectInput } from 'react-admin';
import { Datagrid, List, TextField } from 'react-admin';

const ReportFilter = (props: any) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            <SelectInput
                choices={[
                    { id: 'OPEN', name: translate('reports.OPEN') },
                    { id: 'IN_PROGRESS', name: translate('reports.IN_PROGRESS') },
                    { id: 'CLOSED', name: translate('reports.CLOSED') },
                ]}
                label={translate('reports.status')}
                source="status"
            />
        </Filter>
    );
};

const ReportList = () => {
    const translate = useTranslate();

    return (
        <List filters={<ReportFilter />} exporter={false}>
            <Datagrid>
                <TextField label={translate('global.lastname')} source="user.lastname" />
                <TextField label={translate('global.firstname')} source="user.firstname" />
                <TextField label={translate('global.university')} source="user.university.name" />
                <FunctionField
                    label={translate('reports.status')}
                    render={(record: any) => translate(`reports.${record.status}`)}
                    source="status"
                />
                <TextField label={translate('reports.content')} source="content" />
            </Datagrid>
        </List>
    );
};

export default ReportList;
