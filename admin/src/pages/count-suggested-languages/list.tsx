import React from 'react';
import { useTranslate, Datagrid, List, TextField } from 'react-admin';

const CountSuggestedLanguagesList = () => {
    const translation = useTranslate();

    return (
        <List exporter={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField label={translation('global.language')} sortable={false} source="language.name" />
                <TextField label={translation('count_suggested_languages.total')} sortable={false} source="count" />
            </Datagrid>
        </List>
    );
};

export default CountSuggestedLanguagesList;
