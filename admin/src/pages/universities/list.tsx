import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const UniversityList = (props: any) => (
    <List title="Universités" {...props}>
        <Datagrid rowClick="show">
            <TextField source="name" />
        </Datagrid>
    </List>
);

export default UniversityList;
