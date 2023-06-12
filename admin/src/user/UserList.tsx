import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const UserList = (props: any) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="email" />
        </Datagrid>
    </List>
);

export default UserList;
