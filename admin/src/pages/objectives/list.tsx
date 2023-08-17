import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const ObjectivesList = () => (
    <List bulkActionButtons={false} exporter={false} pagination={false}>
        <Datagrid>
            <TextField source="name" />
        </Datagrid>
    </List>
);

export default ObjectivesList;
