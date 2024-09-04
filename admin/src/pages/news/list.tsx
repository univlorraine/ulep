import React from 'react';
import { List, Datagrid, useTranslate, TextField, FunctionField } from 'react-admin';
import PageTitle from '../../components/PageTitle';

const NewsList = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('news.title')}</PageTitle>
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <TextField label="news.list.title" source="title" />
                    <TextField label="news.list.university" source="university.name" />
                    <TextField label="news.list.defaultLanguage" source="languageCode" />
                    <FunctionField
                        label="news.list.translations"
                        render={(record: any) => {
                            console.log({ record });

                            return record.translations.map((translation: any) => translation.languageCode).join(', ');
                        }}
                    />
                    <TextField label="news.list.status" source="status" />
                </Datagrid>
            </List>
        </>
    );
};

export default NewsList;
