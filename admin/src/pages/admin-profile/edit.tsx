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

import { Edit, useNotify, useTranslate, useUpdate, WithRecord } from 'react-admin';
import { redirect } from 'react-router-dom';
import AdministratorForm from '../../components/form/AdministratorForm';
import Administrator, { AdministratorFormPayload } from '../../entities/Administrator';

const EditAdministratorProfile = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();

    const handleSubmit = async (payload: AdministratorFormPayload) => {
        const formData = new FormData();

        formData.append('id', payload.id || '');
        formData.append('email', payload.email || '');
        formData.append('firstname', payload.firstname || '');
        formData.append('lastname', payload.lastname || '');
        formData.append('password', payload.password || '');
        formData.append('universityId', payload.universityId || '');
        formData.append('languageId', payload.languageId || '');
        formData.append('group[id]', payload.group.id || '');
        formData.append('group[name]', payload.group.name || '');
        formData.append('group[path]', payload.group.path || '');
        if (payload.file) formData.append('file', payload.file);

        try {
            return await update(
                'users/administrators',
                { id: payload.id, data: formData },
                {
                    onSuccess: () => {
                        redirect('users/administrators');
                    },
                    onError: (error) => {
                        console.error(error);
                        notify('administrators.update.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('administrators.update.error');
        }
    };

    return (
        <Edit resource="users/administrators" title={translate('administrators.update.title')}>
            <WithRecord<Administrator>
                label="user/administrator"
                render={(record) => (
                    <AdministratorForm
                        email={record.email}
                        firstname={record.firstname}
                        group={record.group}
                        handleSubmit={handleSubmit}
                        id={record.id}
                        languageId={record.languageId}
                        lastname={record.lastname}
                        type="update"
                        universityId={record.universityId || 'central'}
                        isProfileEdit
                    />
                )}
            />
        </Edit>
    );
};

export default EditAdministratorProfile;
