import React from 'react';
import {
    TopToolbar,
    EditButton,
    ArrayField,
    SingleFieldList,
    ChipField,
    DateField,
    useTranslate,
    SimpleShowLayout,
    TextField,
    Show,
    FunctionField,
    Loading,
} from 'react-admin';
import University from '../../../entities/University';
import useSecurityContext from './useSecurityContext';

const UniversityShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const UniversityShow = (props: any) => {
    const translate = useTranslate();
    const { isLoading, isUniversityAdmin } = useSecurityContext();

    if (isLoading || isUniversityAdmin) return <Loading />;

    return (
        <Show actions={<UniversityShowAction />} title={translate('universities.label')} {...props}>
            <SimpleShowLayout sx={{ m: 3 }}>
                <TextField label={translate('universities.show.name')} source="name" />
                <TextField label={translate('universities.show.country')} source="country.name" />
                <FunctionField
                    label={translate('universities.show.defaultContact')}
                    render={(record: University) =>
                        record.defaultContact
                            ? `${record.defaultContact.firstname} ${record.defaultContact.lastname}`
                            : translate('universities.show.noDefaultContact')
                    }
                />
                <FunctionField
                    label={translate('universities.show.language')}
                    render={(record: University) => translate(`languages_code.${record.nativeLanguage.code}`)}
                />
                <TextField label={translate('universities.show.timezone')} source="timezone" />
                <DateField label={translate('universities.show.admission_start')} source="admissionStart" />
                <DateField label={translate('universities.show.admission_end')} source="admissionEnd" />
                <DateField label={translate('universities.show.open_service')} source="openServiceDate" />
                <DateField label={translate('universities.show.close_service')} source="closeServiceDate" />
                <TextField label={translate('universities.show.max_tandems_per_user')} source="maxTandemsPerUser" />
                <ArrayField label={translate('universities.show.sites')} sortable={false} source="sites">
                    <SingleFieldList linkType={false}>
                        <ChipField source="name" />
                    </SingleFieldList>
                </ArrayField>
                <TextField label={translate('universities.show.codes')} source="codes">
                    <SingleFieldList>
                        <ChipField source="id" />
                    </SingleFieldList>
                </TextField>
                <TextField label={translate('universities.show.domains')} source="domains">
                    <SingleFieldList>
                        <ChipField source="id" />
                    </SingleFieldList>
                </TextField>
                <TextField label={translate('universities.show.website')} source="website" />
                <FunctionField
                    label={translate('universities.show.pairingMode')}
                    render={(data: University) =>
                        translate(`universities.pairingModes.${data.pairingMode.toLowerCase()}`)
                    }
                />
                <TextField label={translate('universities.show.id')} source="id" />
                <TextField label={translate('universities.show.notificationEmail')} source="notificationEmail" />
            </SimpleShowLayout>
        </Show>
    );
};

export default UniversityShow;
