import React from 'react';
import { useTranslate, List, Datagrid, TextField } from 'react-admin';

const ObjectivesList = () => {
    const translate = useTranslate();

    return (
        <List bulkActionButtons={false} exporter={false} pagination={false}>
            <Datagrid>
                <TextField label={translate('objectives.name')} source="name" />
            </Datagrid>
        </List>
    );
};

export default ObjectivesList;
