import React from 'react';
import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';

const LanguageEdit = () => (
    <Edit mutationMode="pessimistic">
        <SimpleForm>
            <TextInput source="name" />
            <BooleanInput source="enabled" />
        </SimpleForm>
    </Edit>
);

export default LanguageEdit;
