import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';
import ReportsPagesHeader from '../../components/tabs/ReportsPagesHeader';

const ReportCategoryList = () => (
    <>
        <ReportsPagesHeader />
        <List bulkActionButtons={false} exporter={false} pagination={false}>
            <Datagrid rowClick="show">
                <TextField source="name" />
            </Datagrid>
        </List>
    </>
);

export default ReportCategoryList;
