import React from 'react';
import { List, Datagrid } from 'react-admin';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';

const NewsList = () => (
    <>
        <ConfigPagesHeader />
        <List exporter={false}>
            <Datagrid bulkActionButtons={false}>TEST</Datagrid>
        </List>
    </>
);

export default NewsList;
