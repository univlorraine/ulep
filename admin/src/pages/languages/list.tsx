import React from 'react';
import { BooleanField, Datagrid, List, TextField } from 'react-admin';

const LanguageList = () => (
    <List exporter={false}>
        <Datagrid bulkActionButtons={false} rowClick="edit">
            <TextField source="code" />
            <TextField source="name" />
            <TextField source="mainUniversityStatus" />
            <BooleanField source="secondaryUniversityActive" />
        </Datagrid>
    </List>
);

export default LanguageList;
