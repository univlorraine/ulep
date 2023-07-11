import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';

const CountryEdit = () => (
    <Edit mutationMode="pessimistic">
        <SimpleForm>
            <TextInput source="code" />
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

export default CountryEdit;
