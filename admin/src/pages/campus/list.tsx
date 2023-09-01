import React from 'react';
import { useTranslate, List, Datagrid, TextField } from 'react-admin';

const CampusList = (props: any) => {
    const translate = useTranslate();

    return (
        <List exporter={false} pagination={false} title={translate('campus.label')} {...props}>
            <Datagrid rowClick="edit">
                <TextField label={translate('campus.name')} source="name" />
            </Datagrid>
        </List>
    );
};

export default CampusList;
