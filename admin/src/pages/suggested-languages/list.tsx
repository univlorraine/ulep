import React from 'react';
import { useTranslate, Datagrid, List, TextField } from 'react-admin';

const SuggestedLanguagesList = () => {
    const translation = useTranslate();

    return (
        <List exporter={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField label={translation('global.firstname')} source="user.firstname" />
                <TextField label={translation('global.lastname')} source="user.lastname" />
                <TextField label={translation('global.role')} source="user.role" />
                <TextField label={translation('global.email')} source="user.email" />
                <TextField label={translation('global.language')} source="language.code" />
            </Datagrid>
        </List>
    );
};

export default SuggestedLanguagesList;
