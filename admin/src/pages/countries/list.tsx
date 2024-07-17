import React from 'react';
import { useTranslate, List, Datagrid, TextField } from 'react-admin';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';

const CountryList = () => {
    const translate = useTranslate();

    return (
        <>
            <ConfigPagesHeader />
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <TextField label={translate('countries.code')} sortable={false} source="code" />
                    <TextField label={translate('countries.name')} sortable={false} source="name" />
                </Datagrid>
            </List>
        </>
    );
};

export default CountryList;
