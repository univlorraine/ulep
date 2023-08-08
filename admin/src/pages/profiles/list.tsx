import React from 'react';
import { ChipField, SingleFieldList, ArrayField, Datagrid, List, TextField, useTranslate } from 'react-admin';

const ProfileList = (props: any) => {
    const translate = useTranslate();

    return (
        <List title={translate('profiles.label')} {...props}>
            <Datagrid rowClick="show">
                <TextField label={translate('profiles.role')} sortable={false} source="user.role" />
                <TextField label={translate('profiles.lastname')} sortable={false} source="user.lastname" />
                <TextField label={translate('profiles.firstname')} sortable={false} source="user.firstname" />
                <TextField label={translate('profiles.email')} sortable={false} source="user.email" />
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
                {/* <BooleanField sortable={false} source="certificate" /> */}
            </Datagrid>
        </List>
    );
};

export default ProfileList;
