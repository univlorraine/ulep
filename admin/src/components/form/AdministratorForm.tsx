import { Box, Input, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Button, Loading, useGetIdentity, useNotify, usePermissions, useTranslate } from 'react-admin';
import { AdministratorFormPayload, KeycloakGroup, Role } from '../../entities/Administrator';
import University from '../../entities/University';
import inputStyle from '../../theme/inputStyle';
import isPasswordValid from '../../utils/isPasswordValid';
import AdminGroupPicker from '../AdminGroupPicker';
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
    const [newEmail, setNewEmail] = useState<string>(email || '');
    const [password, setPassword] = useState<string>('');
    const [newFirstname, setNewFirstname] = useState<string>(firstname || '');
    const [newLastname, setNewLastname] = useState<string>(lastname || '');
    const [university, setUniversity] = useState<University>();
    const [newGroup, setNewGroup] = useState<KeycloakGroup | undefined>(group);
    const [file, setFile] = useState<File>();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    const getUniversityId = (): string | undefined => {
        if (!permissions.checkRole(Role.SUPER_ADMIN)) {
            return identity.universityId;
        }

        return university?.id;
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
        <Box sx={{ m: 4 }}>
            <ImageUploader onImageSelect={setFile} source="image.id" />

            <Typography variant="subtitle1">{translate(`administrators.${type}.email`)}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Email"
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={translate('global.email')}
                    sx={inputStyle}
                    type="email"
                    value={newEmail}
                    disableUnderline
                    required
                />
            </Box>

            {!isProfileEdit && (
                <>
                    {permissions.checkRole(Role.SUPER_ADMIN) && (
                        <>
                            <Typography variant="subtitle1">
                                {translate(`administrators.${type}.university`)}
                            </Typography>
                            <UniversityPicker initialValue={universityId} onChange={setUniversity} value={university} />
                        </>
                    )}

                    <Typography variant="subtitle1">{translate('admin_groups_picker.placeholder')}</Typography>
                    <AdminGroupPicker onChange={setNewGroup} value={newGroup} />
                </>
            )}

            <Typography variant="subtitle1">{translate('global.firstname')}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Firstname"
                    onChange={(e) => setNewFirstname(e.target.value)}
                    placeholder={translate('global.firstname')}
                    sx={inputStyle}
                    value={newFirstname}
                    disableUnderline
                    required
                />
            </Box>

            <Typography variant="subtitle1">{translate(`global.lastname`)}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Lastname"
                    onChange={(e) => setNewLastname(e.target.value)}
                    placeholder={translate('global.lastname')}
                    sx={inputStyle}
                    value={newLastname}
                    disableUnderline
                    required
                />
            </Box>

            <Typography variant="subtitle1">{translate(`administrators.${type}.password`)}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={translate('global.password')}
                    sx={inputStyle}
                    value={password}
                    disableUnderline
                    required
                />
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
