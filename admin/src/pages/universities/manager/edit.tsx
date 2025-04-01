/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
