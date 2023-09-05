import React from 'react';
import { FunctionField, useTranslate, Datagrid, List, TextField } from 'react-admin';
import User from '../../entities/User';

const SuggestedLanguagesList = () => {
    const translation = useTranslate();

    return (
        <List exporter={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField label={translation('global.firstname')} source="user.firstname" />
                <TextField label={translation('global.lastname')} source="user.lastname" />
                <FunctionField
                    label={translation('global.role')}
                    render={(record: { user: User }) => translation(`global.${record.user.role.toLowerCase()}`)}
                    source="user.role"
                />
                <TextField label={translation('global.email')} source="user.email" />
                <TextField label={translation('global.language')} source="language.name" />
            </Datagrid>
        </List>
    );
};

export default SuggestedLanguagesList;
