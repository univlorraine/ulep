import { Box, Typography, Input } from '@mui/material';
import React, { useState } from 'react';
import { Button, Loading, useGetIdentity, useTranslate } from 'react-admin';
import { AdministratorFormPayload } from '../../entities/Administrator';
import University from '../../entities/University';
import inputStyle from '../../theme/inputStyle';
import isPasswordValid from '../../utils/isPasswordValid';
import UniversityPicker from '../UniversityPicker';

interface AdministratorFormProps {
    id?: string;
    email?: string;
    firstname?: string;
    handleSubmit: (payload: AdministratorFormPayload) => void;
    lastname?: string;
    universityId?: string;
    type: string;
}

const AdministratorForm: React.FC<AdministratorFormProps> = ({
    id,
    email,
    firstname,
    handleSubmit,
    lastname,
    universityId,
    type,
}) => {
    const translate = useTranslate();
    const [newEmail, setNewEmail] = useState<string>(email || '');
    const [password, setPassword] = useState<string>('');
    const [newFirstname, setNewFirstname] = useState<string>(firstname || '');
    const [newLastname, setNewLastname] = useState<string>(lastname || '');
    const [university, setUniversity] = useState<University>();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    const getUniversityId = (): string | undefined => {
        if (!identity.isCentralUniversity) {
            return identity.universityId;
        }

        return university?.parent ? university?.id : undefined;
    };

    const onCreatePressed = () => {
        handleSubmit({
            id,
            email: newEmail,
            firstname: newFirstname,
            lastname: newLastname,
            password,
            universityId: getUniversityId(),
        });
    };

    return (
        <Box sx={{ m: 4 }}>
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

            {identity?.isCentralUniversity && (
                <>
                    <Typography variant="subtitle1">{translate(`administrators.${type}.university`)}</Typography>
                    <UniversityPicker initialValue={universityId} onChange={setUniversity} value={university} />
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
                    (!university && identity.isCentralUniversity) ||
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
