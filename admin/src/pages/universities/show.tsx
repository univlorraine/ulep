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
} from 'react-admin';
import ReferenceUploadField from '../../components/field/ReferenceUploadField';
import UniversitiesPagesHeader from '../../components/tabs/UniversitiesPagesHeader';
import Language from '../../entities/Language';
import University from '../../entities/University';

const UniversityShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const UniversityShow = (props: any) => {
    const translate = useTranslate();

    return (
        <>
            <UniversitiesPagesHeader />
            <Show actions={<UniversityShowAction />} title={translate('universities.label')} {...props}>
                <SimpleShowLayout sx={{ m: 3 }}>
                    <ReferenceUploadField label={translate('universities.show.logo')} source="logo.id" />
                    <TextField label={translate('universities.show.name')} source="name" />
                    <TextField label={translate('universities.show.country')} source="country.name" />
                    <FunctionField
                        label={translate('universities.show.language')}
                        render={(record: University) => translate(`languages_code.${record.nativeLanguage.code}`)}
                    />
                    <TextField label={translate('universities.show.timezone')} source="timezone" />
                    <DateField
                        label={translate('universities.show.admission_start')}
                        options={{
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        }}
                        source="admissionStart"
                    />
                    <DateField
                        label={translate('universities.show.admission_end')}
                        options={{
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        }}
                        source="admissionEnd"
                    />
                    <DateField
                        label={translate('universities.show.open_service')}
                        options={{
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        }}
                        source="openServiceDate"
                    />
                    <DateField
                        label={translate('universities.show.close_service')}
                        options={{
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        }}
                        source="closeServiceDate"
                    />
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
                    <ArrayField
                        label={translate('universities.show.specificLanguages')}
                        sortable={false}
                        source="specificLanguagesAvailable"
                    >
                        <SingleFieldList>
                            <FunctionField
                                render={(record: Language) => (
                                    <ChipField
                                        record={{ name: translate(`languages_code.${record.code}`) }}
                                        source="name"
                                    />
                                )}
                            />
                        </SingleFieldList>
                    </ArrayField>
                </SimpleShowLayout>
            </Show>
        </>
    );
};

export default UniversityShow;
