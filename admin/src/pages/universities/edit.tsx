import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import UniversityForm from '../../components/form/UniversityForm';
import UniversitiesTabs from '../../components/tabs/UniversitiesTabs';
import Country from '../../entities/Country';
import Language from '../../entities/Language';
import University from '../../entities/University';
import universityToFormData from './universityToFormData';

const EditUniversity = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (
        id: string,
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
            website,
            notificationEmail,
            specificLanguagesAvailable,
            file
        );

        try {
            return await update(
                `universities/${id}`,
                { data: formData },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/universities');
                        }

                        return notify('universities.update.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('universities.update.error');
        }
    };

    return (
        <>
            <UniversitiesTabs />
            <Edit title={translate('universities.update.title')}>
                <WithRecord<University>
                    label="university"
                    render={(record) => (
                        <UniversityForm
                            admissionEndDate={record.admissionEnd}
                            admissionStartDate={record.admissionStart}
                            canAddNewLanguages={!!record.parent}
                            closeServiceDate={record.closeServiceDate}
                            codes={record.codes}
                            country={record.country}
                            domains={record.domains}
                            handleSubmit={(
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
                                website?: string,
                                notificationEmail?: string,
                                specificLanguagesAvailable?: Language[]
                            ) =>
                                handleSubmit(
                                    record.id,
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
                                    website,
                                    notificationEmail,
                                    specificLanguagesAvailable
                                )
                            }
                            maxTandemsPerUser={record.maxTandemsPerUser}
                            name={record.name}
                            notificationEmail={record.notificationEmail}
                            openServiceDate={record.openServiceDate}
                            pairingMode={record.pairingMode}
                            timezone={record.timezone}
                            tradKey="update"
                            website={record.website}
                        />
                    )}
                />
            </Edit>
        </>
    );
};

export default EditUniversity;
