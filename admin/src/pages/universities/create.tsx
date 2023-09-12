import React from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import UniversityForm from '../../components/form/UniversityForm';
import Country from '../../entities/Country';

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
        codes: string[],
        domains: string[],
        website?: string
    ) => {
        const payload = {
            name,
            countryId: country.id,
            timezone,
            admissionStart,
            admissionEnd,
            codes,
            domains,
            website,
        };

        try {
            return await create(
                'universities/partners',
                { data: payload },
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
        <Create title={translate('universities.create.title')}>
            <UniversityForm handleSubmit={handleSubmit} tradKey="create" />
        </Create>
    );
};

export default CreateUniversity;
