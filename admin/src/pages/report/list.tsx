import React from 'react';
import { Datagrid, List, TextField } from 'react-admin';

const ReportList = () => (
    <List bulkActionButtons={false} exporter={false} pagination={false}>
        <Datagrid rowClick="edit">
            <TextField source="user.lastname" />
            <TextField source="user.firstname" />
            <TextField source="user.university.name" />
            <TextField source="user.university.name" />
            <TextField source="user.university.name" />
        </Datagrid>
    </List>
);

export default ReportList;
