import React from 'react';
import { List, Datagrid, useTranslate } from 'react-admin';
import PageTitle from '../../components/PageTitle';

const NewsList = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('news.title')}</PageTitle>
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>TEST</Datagrid>
            </List>
        </>
    );
};

export default NewsList;
