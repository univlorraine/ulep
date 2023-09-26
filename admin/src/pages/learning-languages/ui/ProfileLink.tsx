import { Typography } from '@mui/material';
import React from 'react';
import { useRedirect } from 'react-admin';
import { Profile, getProfileDisplayName } from '../../../entities/Profile';

interface ProfileLinkParams {
    profile: Profile;
    variant?: string;
}

const ProfileLink = ({ profile, variant }: ProfileLinkParams) => {
    const redirect = useRedirect();

    return (
        <Typography
            onClick={() => {
                redirect('show', 'profiles', profile.id);
            }}
            sx={{ cursor: 'pointer', color: '#3737d5' }}
            // Note: shortcut to avoid typing as precisely as Typography (an error
            // will juste lead to syle not applied)
            variant={variant as any}
        >
            {getProfileDisplayName(profile)}
        </Typography>
    );
};

export default ProfileLink;
