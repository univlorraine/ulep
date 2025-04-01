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
import React, { useState } from 'react';
import { Button, Loading, useGetIdentity, useTranslate } from 'react-admin';
import Administrator from '../../entities/Administrator';
import { Profile, ProfileFormPayload } from '../../entities/Profile';
import AdministratorPicker from '../AdministratorPicker';

interface ProfileFormProps {
    record: Profile;
    handleSubmit: (id: string, payload: ProfileFormPayload) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ record, handleSubmit }) => {
    const translate = useTranslate();
    const [newEmail, setNewEmail] = useState<string>(record.user.email || '');
    const [newFirstname, setNewFirstname] = useState<string>(record.user.firstname || '');
    const [newLastname, setNewLastname] = useState<string>(record.user.lastname || '');
    const [newContact, setNewContact] = useState<Administrator>(record.user.contact || '');
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }
    const onCreatePressed = () =>
        handleSubmit(record.user.id, {
            email: newEmail,
            firstname: newFirstname,
            lastname: newLastname,
            contactId: newContact.id,
        });

    return (
        <Box display="flex" flexDirection="column" gap="30px">
            <Box>
                <Typography variant="subtitle1">{translate(`global.email`)}</Typography>
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
            </Box>

            <Box display="flex" flexDirection="row" gap="30px">
                <Box flex="1">
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

                <Box flex="1">
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
            </Box>

            <Box>
                <Typography variant="subtitle1">{translate(`profiles.contact`)}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <AdministratorPicker
                        onChange={setNewContact}
                        universityId={record.user.university.id}
                        value={newContact}
                    />
                </Box>
            </Box>

            <Button
                color="primary"
                disabled={!newFirstname || !newLastname || !newEmail}
                onClick={onCreatePressed}
                sx={{ mt: 3 }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default ProfileForm;
