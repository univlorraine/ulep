import React from 'react';
import { useTranslate, List, Datagrid, TextField } from 'react-admin';
import PageTitle from '../../components/PageTitle';

const ObjectivesList = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('objectives.title')}</PageTitle>
            <List bulkActionButtons={false} exporter={false} pagination={false}>
                <Datagrid rowClick="show">
                    <TextField label={translate('objectives.name')} sortable={false} source="name" />
                </Datagrid>
            </List>
        </>
    );
};

export default ObjectivesList;
