import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const ReportCategoryList = () => (
    <List bulkActionButtons={false} exporter={false}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
        </Datagrid>
    </List>
);

export default ReportCategoryList;
