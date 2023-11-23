import React from 'react';
import { Datagrid, List, Loading, ReferenceField, TextField, useGetIdentity, useTranslate } from 'react-admin';

const AdministratorList = (props: any) => {
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <List
            exporter={false}
            filter={!identity?.isCentralUniversity ? { universityId: identity.universityId } : undefined}
            pagination={false}
            title={translate('administrators.label')}
            {...props}
        >
            <Datagrid rowClick="edit">
                <TextField label={translate('global.email')} source="email" />
                {identity.isCentralUniversity && (
                    <ReferenceField
                        emptyText={translate('administrators.all')}
                        label={translate('administrators.university')}
                        reference="universities"
                        source="universityId"
                    />
                )}
            </Datagrid>
        </List>
    );
};

export default AdministratorList;
