import React from 'react';
import { Datagrid, List, ReferenceField, TextField, useTranslate } from 'react-admin';

const AdministratorList = (props: any) => {
    const translate = useTranslate();

    return (
        <List exporter={false} pagination={false} title={translate('administrators.label')} {...props}>
            <Datagrid>
                <TextField label={translate('global.email')} source="email" />
                <ReferenceField
                    emptyText={translate('administrators.all')}
                    label={translate('administrators.university')}
                    reference="universities"
                    source="universityId"
                />
            </Datagrid>
        </List>
    );
};

export default AdministratorList;
