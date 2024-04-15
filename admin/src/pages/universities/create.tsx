import React from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import UniversityForm from '../../components/form/UniversityForm';
import UniversitiesPagesHeader from '../../components/tabs/UniversitiesPagesHeader';
import Country from '../../entities/Country';
import Language from '../../entities/Language';
import universityToFormData from './universityToFormData';

const CreateUniversity = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (
        name: string,
        country: Country,
        timezone: string,
        admissionStart: Date,
        admissionEnd: Date,
        openServiceDate: Date,
        closeServiceDate: Date,
        codes: string[],
        domains: string[],
        pairingMode: string,
        maxTandemsPerUser: number,
        nativeLanguage: Language,
        website?: string,
        notificationEmail?: string,
        specificLanguagesAvailable?: Language[],
        file?: File
    ) => {
        const formData = universityToFormData(
            name,
            country,
            timezone,
            admissionStart,
            admissionEnd,
            openServiceDate,
            closeServiceDate,
            codes,
            domains,
            pairingMode,
            maxTandemsPerUser,
            nativeLanguage,
            website,
            notificationEmail,
            specificLanguagesAvailable,
            file
        );

        try {
            return await create(
                'universities/partners',
                { data: formData },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/universities');
                        }

                        return notify('universities.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('universities.create.error');
        }
    };

    return (
        <>
            <UniversitiesPagesHeader />
            <Create title={translate('universities.create.title')}>
                <UniversityForm canAddNewLanguages={false} handleSubmit={handleSubmit} tradKey="create" />
            </Create>
        </>
    );
};

export default CreateUniversity;
