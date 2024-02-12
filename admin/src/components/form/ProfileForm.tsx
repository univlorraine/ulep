import { Box, Typography, Input } from '@mui/material';
import React, { useState } from 'react';
import { Button, Loading, useGetIdentity, useTranslate } from 'react-admin';
import { Profile, ProfileFormPayload } from '../../entities/Profile';
import inputStyle from '../../theme/inputStyle';

interface ProfileFormProps {
    record: Profile;
    handleSubmit: (payload: ProfileFormPayload) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ record, handleSubmit }) => {
    const translate = useTranslate();
    const [newEmail, setNewEmail] = useState<string>(record.user.email || '');
    const [newFirstname, setNewFirstname] = useState<string>(record.user.firstname || '');
    const [newLastname, setNewLastname] = useState<string>(record.user.lastname || '');
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }
    const onCreatePressed = () =>
        handleSubmit({
            id: record.user.id,
            email: newEmail,
            firstname: newFirstname,
            lastname: newLastname,
        });

    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate(`global.email`)}</Typography>

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

            <Button
                color="primary"
                disabled={!newFirstname || !newLastname || !newEmail}
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

export default ProfileForm;
