import React from 'react';
import { useTranslate, List, Datagrid, TextField } from 'react-admin';
import UniversitiesPagesHeader from '../../components/tabs/UniversitiesPagesHeader';

const CampusList = (props: any) => {
    const translate = useTranslate();

    return (
        <>
            <UniversitiesPagesHeader />
            <List exporter={false} pagination={false} title={translate('campus.label')} {...props}>
                <Datagrid rowClick="edit">
                    <TextField label={translate('campus.name')} source="name" />
                </Datagrid>
            </List>
        </>
    );
};

export default CampusList;
