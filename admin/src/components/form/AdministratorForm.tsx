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

import { Box, OutlinedInput, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, Loading, useGetIdentity, useGetList, useNotify, usePermissions, useTranslate } from 'react-admin';
import { AdminGroup, AdministratorFormPayload, KeycloakGroup, Role } from '../../entities/Administrator';
import Language from '../../entities/Language';
import University, { isCentralUniversity } from '../../entities/University';
import isPasswordValid from '../../utils/isPasswordValid';
import AdminGroupPicker from '../adminGroups/AdminGroupPicker';
import ImageUploader from '../ImageUploader';
import LanguagePicker from '../LanguagePicker';
import UniversityPicker from '../UniversityPicker';

interface AdministratorFormProps {
    id?: string;
    email?: string;
    firstname?: string;
    handleSubmit: (payload: AdministratorFormPayload) => void;
    lastname?: string;
    universityId?: string;
    languageId?: string;
    group?: KeycloakGroup;
    type: string;
    isProfileEdit?: boolean;
}

const AdministratorForm: React.FC<AdministratorFormProps> = ({
    id,
    email,
    firstname,
    handleSubmit,
    lastname,
    universityId,
    languageId,
    group,
    type,
    isProfileEdit = false,
}) => {
    const translate = useTranslate();
    const notify = useNotify();
    const { permissions } = usePermissions();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { data: universities, isLoading: isLoadingUniversities } = useGetList<University>('universities');
    const [newEmail, setNewEmail] = useState<string>(email || '');
    const [password, setPassword] = useState<string>('');
    const [newFirstname, setNewFirstname] = useState<string>(firstname || '');
    const [newLastname, setNewLastname] = useState<string>(lastname || '');
    const [newUniversityId, setNewUniversityId] = useState<string>(universityId || '');
    const [newGroup, setNewGroup] = useState<KeycloakGroup | undefined>(group);
    const [newLanguage, setNewLanguage] = useState<Language>();
    const [file, setFile] = useState<File>();

    // Fix cache issue
    useEffect(() => {
        if (email && email !== newEmail) {
            setNewEmail(email);
        }
        if (firstname && firstname !== newFirstname) {
            setNewFirstname(firstname);
        }
        if (lastname && lastname !== newLastname) {
            setNewLastname(lastname);
        }
        if (universityId && universityId !== newUniversityId) {
            setNewUniversityId(universityId);
        }
        if (group && group !== newGroup) {
            setNewGroup(group);
        }
    }, [email, firstname, lastname, universityId, languageId, group, universities]);

    if (isLoadingIdentity || !identity || isLoadingUniversities || !universities) {
        return <Loading />;
    }

    const currentUniversity = universities.find((u) => u.id === universityId);
    const newUniversity = universities.find((u) => u.id === newUniversityId);
    const isSelectedUniversityIsCentral = newUniversity && isCentralUniversity(newUniversity);
    const isCurrentUniversityIsCentral =
        isSelectedUniversityIsCentral === undefined && currentUniversity
            ? isCentralUniversity(currentUniversity)
            : false;

    const getUniversityId = (): string | undefined => {
        if (newUniversity) {
            return newUniversity?.id;
        }

        return identity.universityId;
    };

    const onCreatePressed = () => {
        if (!newGroup) {
            return notify(translate('admin_groups_picker.mandatory'));
        }

        return handleSubmit({
            id,
            email: newEmail,
            firstname: newFirstname,
            lastname: newLastname,
            password: password ?? undefined,
            universityId: getUniversityId(),
            group: newGroup,
            file,
            languageId: newLanguage?.id !== 'none' ? newLanguage?.id : null,
        });
    };

    const isEmailValid = (): boolean => {
        if (isSelectedUniversityIsCentral) {
            return newUniversity.domains.some((domain) => newEmail.endsWith(domain));
        }

        if (currentUniversity && isCurrentUniversityIsCentral) {
            return currentUniversity.domains.some((domain) => newEmail.endsWith(domain));
        }

        return Boolean(newEmail);
    };

    return (
        <Box sx={{ m: 4, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ImageUploader onImageSelect={setFile} source="image.id" />

            <Box>
                <Typography variant="subtitle1">{translate(`administrators.${type}.email`)}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <OutlinedInput
                        name="Email"
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={translate('global.email')}
                        type="email"
                        value={newEmail}
                        required
                    />
                </Box>
                {newEmail && !isEmailValid() && (
                    <Typography color="error">{translate('administrators.errors.email')}</Typography>
                )}
            </Box>

            {!isProfileEdit && (
                <>
                    {newGroup?.name === AdminGroup.SUPER_ADMIN ||
                        (permissions.checkRole(Role.SUPER_ADMIN) && (
                            <Box>
                                <Typography variant="subtitle1">
                                    {translate(`administrators.${type}.university`)}
                                </Typography>
                                <UniversityPicker
                                    onChange={setNewUniversityId}
                                    universities={universities}
                                    value={newUniversityId}
                                />
                            </Box>
                        ))}
                    <Box>
                        <Typography variant="subtitle1">{translate('admin_groups_picker.placeholder')}</Typography>
                        <AdminGroupPicker
                            isCentralUniversity={isSelectedUniversityIsCentral ?? isCurrentUniversityIsCentral}
                            onChange={setNewGroup}
                            value={newGroup}
                        />
                    </Box>
                </>
            )}

            <Box>
                <Typography variant="subtitle1">{translate('global.firstname')}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <OutlinedInput
                        name="Firstname"
                        onChange={(e) => setNewFirstname(e.target.value)}
                        placeholder={translate('global.firstname')}
                        value={newFirstname}
                        required
                    />
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle1">{translate(`global.lastname`)}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <OutlinedInput
                        name="Lastname"
                        onChange={(e) => setNewLastname(e.target.value)}
                        placeholder={translate('global.lastname')}
                        value={newLastname}
                        required
                    />
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle1">{translate('global.language')}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <LanguagePicker initialValue={languageId} onChange={setNewLanguage} value={newLanguage} />
                </Box>
            </Box>

            {!identity.isCentralUniversity && identity.id === id && (
                <Box>
                    <Typography variant="subtitle1">{translate(`administrators.${type}.password`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <OutlinedInput
                            name="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={translate('global.password')}
                            value={password}
                            required
                        />
                    </Box>
                </Box>
            )}

            <Button
                color="primary"
                disabled={
                    (password ? !isPasswordValid(password) : false) ||
                    !newFirstname ||
                    !newLastname ||
                    !getUniversityId() ||
                    !isEmailValid()
                }
                onClick={onCreatePressed}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default AdministratorForm;
