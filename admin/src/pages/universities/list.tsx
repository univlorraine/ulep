import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const UniversityList = (props: any) => (
    <List title="Universités" {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
        </Datagrid>
    </List>
);

export default UniversityList;
