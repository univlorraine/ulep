import React from 'react';
import { Datagrid, List, TextField } from 'react-admin';

const ReportList = () => (
    <List bulkActionButtons={false} exporter={false} pagination={false}>
        <Datagrid>
            <TextField source="user.lastname" />
            <TextField source="user.firstname" />
            <TextField source="user.university.name" />
            <TextField source="status" />
            <TextField source="content" />
        </Datagrid>
    </List>
);

export default ReportList;
