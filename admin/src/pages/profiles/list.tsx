import React from 'react';
import { SelectInput, ReferenceInput, Filter,
    TextInput,
    ChipField,
    SingleFieldList,
    ArrayField,
    Datagrid, List,
    TextField,
    useTranslate } from 'react-admin';

const ProfileFilter = (props: any) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            <TextInput label={translate('profiles.firstname')} source="user.firstname" />
            <TextInput label={translate('profiles.lastname')} source="user.lastname" />
            <TextInput label={translate('profiles.email')} source="user.email" />
            <ReferenceInput
                label={translate('profiles.country')}
                reference="countries"
                source="user.country"
            >
                <SelectInput
                    label={translate('profiles.country')}
                    optionText="name"
                    optionValue="code"
                />
            </ReferenceInput>
            <ReferenceInput
                label={translate('profiles.university')}
                reference="universities"
                source="user.university"
            >
                <SelectInput
                    label={translate('profiles.university')}
                    optionText="name"
                />
            </ReferenceInput>
            <ReferenceInput
                label={translate('profiles.native_language')}
                reference="languages"
                source="nativeLanguageCode"
            >
                <SelectInput
                    label={translate('profiles.native_language')}
                    optionText="code"
                    optionValue="code"
                />
            </ReferenceInput>
            <ReferenceInput
                label={translate('profiles.mastered_languages')}
                reference="languages"
                source="masteredLanguageCode"
            >
                <SelectInput
                    label={translate('profiles.mastered_languages')}
                    optionText="code"
                    optionValue="code"
                />
            </ReferenceInput>
            <SelectInput
                choices={[
                    { id: 'STUDENT', name: translate('global.Student') },
                    { id: 'STAFF', name: translate('global.Staff') },
                ]}
                label={translate('profiles.role')}
                source="user.role"
            />
        </Filter>
    );
};

const ProfileList = (props: any) => {
    const translate = useTranslate();

    return (
        <List exporter={false} filters={<ProfileFilter />} title={translate('profiles.label')} {...props}>
            <Datagrid rowClick="show">
                <TextField label={translate('profiles.role')} source="user.role" sortable />
                <TextField label={translate('profiles.lastname')} source="user.lastname" sortable />
                <TextField label={translate('profiles.firstname')} source="user.firstname" sortable />
                <TextField label={translate('profiles.email')} source="user.email" sortable />
                <TextField
                    label={translate('profiles.university')}
                    source="user.university.name"
                    sortable
                />
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
