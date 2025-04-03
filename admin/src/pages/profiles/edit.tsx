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
import {
    useTranslate,
    Edit,
    WithRecord,
    useUpdate,
    useRedirect,
    useNotify,
    useGetIdentity,
    Loading,
    usePermissions,
} from 'react-admin';
import ProfileForm from '../../components/form/ProfileForm';
import PageTitle from '../../components/PageTitle';
import { Role } from '../../entities/Administrator';
import { Profile, ProfileFormPayload } from '../../entities/Profile';

const ProfileEdit = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();
    const identity = useGetIdentity();
    const { permissions } = usePermissions();

    const handleSubmit = async (id: string, payload: ProfileFormPayload) => {
        try {
            const user = await update(
                'users',
                {
                    id,
                    data: payload,
                },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/profiles');
                        }

                        return notify('profiles.update.error');
                    },
                }
            );

            return { user };
        } catch (err) {
            console.error(err);

            return notify('profiles.update.error');
        }
    };

    if (!identity) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle>{translate('profiles.title')}</PageTitle>
            <Edit title={translate('profiles.update.title')}>
                <WithRecord<Profile>
                    label="profiles"
                    render={(record) => {
                        const isCentralUniversity = identity?.identity?.isCentralUniversity;
                        const adminUniversityId = identity?.identity?.universityId;
                        const profileUniversityId = record.user.university.id;

                        if (
                            !permissions.checkRoles([Role.MANAGER, Role.SUPER_ADMIN]) ||
                            (!isCentralUniversity && adminUniversityId !== profileUniversityId)
                        ) {
                            return <div>{translate('profiles.update.unauthorized')}</div>;
                        }

                        return <ProfileForm handleSubmit={handleSubmit} record={record} />;
                    }}
                />
            </Edit>
        </>
    );
};

export default ProfileEdit;
