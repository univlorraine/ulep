import React from 'react';
import { useTranslate, Show, SimpleShowLayout, TextField, ImageField, ArrayField, Datagrid } from 'react-admin';

const ObjectiveShow = () => {
    const translate = useTranslate();

    return (
        <Show>
            <SimpleShowLayout>
                <TextField label={translate('objectives.name')} source="name" />

                <ImageField label={translate('global.image')} source="image.url" />

                <ArrayField label={translate('global.translations')} source="translations">
                    <Datagrid>
                        <TextField label="Code" source="code" />
                        <TextField label="Contenu" source="content" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    );
};

export default ObjectiveShow;
