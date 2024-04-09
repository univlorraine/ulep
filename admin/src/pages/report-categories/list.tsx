import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';
import ReportsTabs from '../../components/tabs/ReportsTabs';

const ReportCategoryList = () => (
    <>
        <ReportsTabs />
        <List bulkActionButtons={false} exporter={false} pagination={false}>
            <Datagrid rowClick="show">
                <TextField source="name" />
            </Datagrid>
        </List>
    </>
);

export default ReportCategoryList;
