import React from 'react';
import { Filter, TextInput, useTranslate, List, Datagrid, TextField } from 'react-admin';

const UserFilter = (props: any) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            <TextInput label={translate('users.searchEmail')} source="email" alwaysOn />
        </Filter>
    );
};

const UserList = (props: any) => {
    const translate = useTranslate();

    return (
        <List filters={<UserFilter />} title={translate('users.userListTitle')} {...props}>
            <Datagrid>
                <TextField sortable={false} source="id" />
                <TextField sortable={false} source="email" />
            </Datagrid>
        </List>
    );
};

export default UserList;
