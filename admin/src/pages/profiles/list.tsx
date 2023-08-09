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
            <TextInput label={translate('profiles.firstname')} source="user.firstname" alwaysOn />
            <TextInput label={translate('profiles.lastname')} source="user.lastname" alwaysOn />
            <TextInput label={translate('profiles.email')} source="email" alwaysOn />
            <ReferenceInput
                reference="countries"
                source="user.country"
                alwaysOn
            >
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput
                label={translate('profiles.university')}
                reference="universities"
                source="user.university"
                alwaysOn
            >
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput
                label={translate('profiles.native_language')}
                reference="languages"
                source="nativeLanguageCode"
                alwaysOn
            >
                <SelectInput optionText="code" />
            </ReferenceInput>
            <ReferenceInput
                label={translate('profiles.mastered_language')}
                reference="languages"
                source="masteredLanguageCodes"
                alwaysOn
            >
                <SelectInput optionText="code" />
            </ReferenceInput>
            <SelectInput
                choices={[
                    { id: 'STUDENT', name: translate('Student') },
                    { id: 'STAFF', name: translate('Staff') },
                ]}
                label={translate('profiles.role')}
                source="user.role"
                alwaysOn
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
