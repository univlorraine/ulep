import { Box, Typography, Input } from '@mui/material';
import React, { useState } from 'react';
import { Button, Loading, useGetIdentity, useTranslate } from 'react-admin';
import University from '../../entities/University';
import inputStyle from '../../theme/inputStyle';
import isPasswordValid from '../../utils/isPasswordValid';
import UniversityPicker from '../UniversityPicker';

interface AdministratorFormProps {
    email?: string;
    handleSubmit: (email: string, password?: string, universityId?: string) => void;
    universityId?: string;
    type: string;
}

const AdministratorForm: React.FC<AdministratorFormProps> = ({ email, handleSubmit, universityId, type }) => {
    const translate = useTranslate();
    const [newEmail, setNewEmail] = useState<string>(email || '');
    const [password, setPassword] = useState<string>('');
    const [university, setUniversity] = useState<University>();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }
    const onCreatePressed = () => {
        if (!identity.isCentralUniversity) {
            return handleSubmit(newEmail, password, identity.universityId);
        }

        return handleSubmit(newEmail, password, university?.parent ? university?.id : undefined);
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
