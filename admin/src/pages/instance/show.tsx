import React from 'react';
import {
    TopToolbar,
    EditButton,
    useTranslate,
    Show,
    SimpleShowLayout,
    TextField,
    UrlField,
    EmailField,
} from 'react-admin';
import { ColorField } from 'react-admin-color-picker';

const InstanceShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const InstanceShow = () => {
    const translate = useTranslate();

    return (
        <Show actions={<InstanceShowAction />} title={translate('instance.label')}>
            <SimpleShowLayout sx={{ m: 3 }}>
                <TextField label={translate('instance.name')} source="name" />
                <EmailField label={translate('instance.email')} source="email" />
                <UrlField label={translate('instance.cgu')} source="cguUrl" />
                <UrlField label={translate('instance.confidentiality')} source="confidentialityUrl" />
                <UrlField label={translate('instance.ressource')} source="ressourceUrl" />
                <ColorField label={translate('instance.primaryColor')} source="primaryColor" />
                <ColorField label={translate('instance.primaryBackgroundColor')} source="primaryBackgroundColor" />
                <ColorField label={translate('instance.primaryDarkColor')} source="primaryDarkColor" />
                <ColorField label={translate('instance.secondaryColor')} source="secondaryColor" />
                <ColorField label={translate('instance.secondaryBackgroundColor')} source="secondaryBackgroundColor" />
                <ColorField label={translate('instance.secondaryDarkColor')} source="secondaryDarkColor" />
            </SimpleShowLayout>
        </Show>
    );
};

export default InstanceShow;
