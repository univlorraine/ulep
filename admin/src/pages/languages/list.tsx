import React from 'react';
import { BooleanField, Datagrid, List, TextField } from 'react-admin';

const LanguageList = () => (
    <List exporter={false}>
        <Datagrid bulkActionButtons={false} rowClick="edit">
            <TextField source="code" />
            <TextField source="name" />
            <BooleanField source="enabled" />
        </Datagrid>
    </List>
);

export default LanguageList;
