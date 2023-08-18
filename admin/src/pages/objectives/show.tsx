import React from 'react';
import { useTranslate, Show, SimpleShowLayout, TextField, ImageField, ArrayField, Datagrid } from 'react-admin';
import style from './show.module.css';

const ObjectiveShow = () => {
    const translate = useTranslate();

    return (
        <Show title={translate('objectives.label')}>
            <SimpleShowLayout>
                <TextField label={translate('objectives.name')} source="name.content" />

                <ImageField label={translate('global.image')} source="image.url" />

                <ArrayField label={translate('global.translations')} source="name.translations">
                    <Datagrid className={style['hide-checkbox']}>
                        <TextField label="Code" source="language" />
                        <TextField label="Contenu" source="content" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    );
};

export default ObjectiveShow;
