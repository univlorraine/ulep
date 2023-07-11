import React from 'react';
import { useTranslate, List, Datagrid, TextField } from 'react-admin';

const ProfileList = (props: any) => {
    const translate = useTranslate();

    return (
        <List title={translate('profiles.label')} {...props}>
            <Datagrid rowClick="show">
                <TextField sortable={false} source="lastname" />
                <TextField sortable={false} source="firstname" />
                <TextField sortable={false} source="university.name" />
                <TextField source="role" />
                <TextField sortable={false} source="age" />
                <TextField source="nativeLanguage.code" sortable />
                <TextField sortable={false} source="learningLanguage.code" />
            </Datagrid>
        </List>
    );
};

export default ProfileList;
