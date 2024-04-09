import React from 'react';
import { useTranslate, List, Datagrid, TextField } from 'react-admin';
import ConfigTabs from '../../components/tabs/ConfigTabs';

const CountryList = () => {
    const translate = useTranslate();

    return (
        <>
            <ConfigTabs />
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <TextField label={translate('countries.code')} source="code" />
                    <TextField label={translate('countries.name')} source="name" />
                </Datagrid>
            </List>
        </>
    );
};

export default CountryList;
