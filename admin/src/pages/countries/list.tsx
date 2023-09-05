import React from 'react';
import { useTranslate, List, Datagrid, TextField } from 'react-admin';

const CountryList = () => {
    const translate = useTranslate();

    return (
        <List exporter={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField label={translate('countries.code')} source="code" />
                <TextField label={translate('countries.name')} source="name" />
            </Datagrid>
        </List>
    );
};

export default CountryList;
