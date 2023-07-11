import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const CountryList = () => (
    <List bulkActionButtons={false} exporter={false}>
        <Datagrid rowClick="edit">
            <TextField source="code" />
            <TextField source="name" />
        </Datagrid>
    </List>
);

export default CountryList;
