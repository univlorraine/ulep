import { Box, OutlinedInput, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Button, Loading, useGetIdentity, useGetList, useNotify, usePermissions, useTranslate } from 'react-admin';
import { AdminGroup, AdministratorFormPayload, KeycloakGroup, Role } from '../../entities/Administrator';
import University, { isCentralUniversity } from '../../entities/University';
import isPasswordValid from '../../utils/isPasswordValid';
import AdminGroupPicker from '../adminGroups/AdminGroupPicker';
import ImageUploader from '../ImageUploader';
import UniversityPicker from '../UniversityPicker';

interface AdministratorFormProps {
    id?: string;
    email?: string;
    firstname?: string;
    handleSubmit: (payload: AdministratorFormPayload) => void;
    lastname?: string;
    universityId?: string;
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
    group,
    type,
    isProfileEdit = false,
}) => {
    const translate = useTranslate();
    const notify = useNotify();
    const { permissions } = usePermissions();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { data: universities } = useGetList<University>('universities');
    const [newEmail, setNewEmail] = useState<string>(email || '');
    const [password, setPassword] = useState<string>('');
    const [newFirstname, setNewFirstname] = useState<string>(firstname || '');
    const [newLastname, setNewLastname] = useState<string>(lastname || '');
    const [university, setUniversity] = useState<University | undefined>(universities?.find(isCentralUniversity));
    const [newGroup, setNewGroup] = useState<KeycloakGroup | undefined>(group);
    const [file, setFile] = useState<File>();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    const getUniversityId = (): string | undefined => {
        if (university) {
            return university?.id;
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
            password,
            universityId: getUniversityId(),
            group: newGroup,
            file,
        });
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
                                    initialValue={universityId}
                                    onChange={setUniversity}
                                    value={university}
                                />
                            </Box>
                        ))}
                    <Box>
                        <Typography variant="subtitle1">{translate('admin_groups_picker.placeholder')}</Typography>
                        <AdminGroupPicker onChange={setNewGroup} university={university} value={newGroup} />
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

            <Button
                color="primary"
                disabled={
                    (email && !password ? false : !password || !isPasswordValid(password)) ||
                    !newFirstname ||
                    !newLastname ||
                    !newEmail
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
