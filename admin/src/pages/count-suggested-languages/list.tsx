import React from 'react';
import { useTranslate, Datagrid, List, TextField } from 'react-admin';
import ConfigTabs from '../../components/tabs/ConfigTabs';

const CountSuggestedLanguagesList = () => {
    const translation = useTranslate();

    return (
        <>
            <ConfigTabs />
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <TextField label={translation('global.language')} sortable={false} source="language.name" />
                    <TextField label={translation('count_suggested_languages.total')} sortable={false} source="count" />
                </Datagrid>
            </List>
        </>
    );
};

export default CountSuggestedLanguagesList;
