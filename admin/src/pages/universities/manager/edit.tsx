import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord, Loading } from 'react-admin';
import UniversityForm from '../../../components/form/UniversityForm';
import Administrator from '../../../entities/Administrator';
import Country from '../../../entities/Country';
import Language from '../../../entities/Language';
import University from '../../../entities/University';
import universityToFormData from '../universityToFormData';
import useSecurityContext from './useSecurityContext';

const EditUniversity = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();
    const redirect = useRedirect();
    const { isLoading, isUniversityAdmin } = useSecurityContext();

    if (isLoading || isUniversityAdmin) return <Loading />;

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
        nativeLanguage: Language,
        website?: string,
        notificationEmail?: string,
        specificLanguagesAvailable?: Language[],
        defaultContact?: Administrator,
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
            defaultContact,
            file
        );

        try {
            return await update(
                `universities/${id}`,
                { data: formData },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('show', 'universities', id);
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
        <Edit redirect="show" title={translate('universities.update.title')}>
            <WithRecord<University>
                label="university"
                render={(record) => (
                    <UniversityForm
                        admissionEndDate={record.admissionEnd}
                        admissionStartDate={record.admissionStart}
                        canAddNewLanguages={false}
                        closeServiceDate={record.closeServiceDate}
                        codes={record.codes}
                        country={record.country}
                        defaultContact={record.defaultContact}
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
                            nativeLanguage: Language,
                            website?: string,
                            notificationEmail?: string,
                            specificLanguagesAvailable?: Language[],
                            defaultContact?: Administrator,
                            file?: File
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
                                nativeLanguage,
                                website,
                                notificationEmail,
                                specificLanguagesAvailable,
                                defaultContact,
                                file
                            )
                        }
                        maxTandemsPerUser={record.maxTandemsPerUser}
                        name={record.name}
                        nativeLanguage={record.nativeLanguage}
                        notificationEmail={record.notificationEmail}
                        openServiceDate={record.openServiceDate}
                        pairingMode={record.pairingMode}
                        timezone={record.timezone}
                        tradKey="update"
                        universityId={record.parent ? record.id : undefined}
                        website={record.website}
                    />
                )}
            />
        </Edit>
    );
};

export default EditUniversity;
