import React from 'react';
import { useTranslate, Datagrid, List, TextField, FunctionField } from 'react-admin';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';

const CountSuggestedLanguagesList = () => {
    const translation = useTranslate();

    return (
        <>
            <ConfigPagesHeader />
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <FunctionField
                        label={translation('global.language')}
                        render={(record: any) => translation(`languages_code.${record.language.code}`)}
                        sortable={false}
                    />
                    <TextField label={translation('count_suggested_languages.total')} sortable={false} source="count" />
                </Datagrid>
            </List>
        </>
    );
};

export default CountSuggestedLanguagesList;
