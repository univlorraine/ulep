import React from 'react';
import {
    TopToolbar,
    EditButton,
    useTranslate,
    Show,
    SimpleShowLayout,
    TextField,
    ImageField,
    ArrayField,
    Datagrid,
} from 'react-admin';

const ObjectiveShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const ObjectiveShow = () => {
    const translate = useTranslate();

    return (
        <Show actions={<ObjectiveShowAction />} title={translate('objectives.label')}>
            <SimpleShowLayout sx={{ m: 3 }}>
                <TextField label={translate('objectives.name')} source="name.content" />

                <ImageField label={translate('global.image')} source="image.url" />

                <ArrayField label={translate('global.translations')} source="name.translations">
                    <Datagrid bulkActionButtons={false}>
                        <TextField label="Code" source="language" />
                        <TextField label="Contenu" source="content" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    );
};

export default ObjectiveShow;
