import { Chip } from '@mui/material';
import React from 'react';
import { List, Datagrid, TextField, FunctionField, DateField } from 'react-admin';
import PageTitle from '../../components/PageTitle';
import { Edito, EditoTranslation } from '../../entities/Edito';

const EditoList = () => (
    <>
        <PageTitle>Editos</PageTitle>
        <List exporter={false} pagination={false}>
            <Datagrid rowClick="edit">
                <TextField label="editos.list.university" sortable={false} source="university.name" />
                <FunctionField
                    label="editos.list.translations"
                    render={(record: Edito) => (
                        <>
                            <Chip label={record.languageCode} />
                            {record.translations.map((translation: EditoTranslation) => (
                                <Chip key={translation.languageCode} label={translation.languageCode} />
                            ))}
                        </>
                    )}
                    sortable={false}
                    source="translations"
                />
                <DateField label="editos.list.updatedAt" sortable={false} source="updatedAt" />
            </Datagrid>
        </List>
    </>
);

export default EditoList;
