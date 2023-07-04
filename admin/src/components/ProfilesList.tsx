import React from 'react';
import { useTranslate, List, Datagrid, TextField } from 'react-admin';

const ProfileList = (props: any) => {
    const translate = useTranslate();

    return (
        <List title={translate('profiles.label')} {...props}>
            <Datagrid>
                <TextField sortable={false} source="lastname" />
                <TextField sortable={false} source="firstname" />
                <TextField sortable={false} source="age" />
                <TextField sortable={false} source="nativeLanguage.code" />
                <TextField sortable={false} source="learningLanguage.code" />
                <TextField sortable={false} source="goals" />
            </Datagrid>
        </List>
    );
};

export default ProfileList;
