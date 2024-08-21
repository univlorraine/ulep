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
