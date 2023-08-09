import React from 'react';
import { ChipField, SingleFieldList, ArrayField, Datagrid, List, TextField, useTranslate } from 'react-admin';

const ProfileList = (props: any) => {
    const translate = useTranslate();

    return (
        <List title={translate('profiles.label')} {...props}>
            <Datagrid rowClick="show">
                <TextField label={translate('profiles.role')} source="user.role" sortable />
                <TextField label={translate('profiles.lastname')} source="user.lastname" sortable />
                <TextField label={translate('profiles.firstname')} source="user.firstname" sortable />
                <TextField label={translate('profiles.email')} source="user.email" sortable />
                <TextField label={translate('profiles.university')} sortable={false} source="user.university.name" />
                <TextField
                    label={translate('profiles.native_language')}
                    sortable={false}
                    source="nativeLanguage.code"
                />
                <ArrayField
                    label={translate('profiles.mastered_languages')}
                    sortable={false}
                    source="masteredLanguages"
                >
                    <SingleFieldList>
                        <ChipField source="code" />
                    </SingleFieldList>
                </ArrayField>
            </Datagrid>
        </List>
    );
};

export default ProfileList;
