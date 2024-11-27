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
                    !newUniversityId ||
                    newUniversityId === 'central' ||
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
