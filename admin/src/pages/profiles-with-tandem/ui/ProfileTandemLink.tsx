import { Typography } from '@mui/material';
import React from 'react';
import { useRedirect } from 'react-admin';
import { Profile, getProfileDisplayName } from '../../../entities/Profile';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';

interface ProfileWithTandemLinkParams {
    profile: Profile;
    variant?: string;
}

const ProfileWithTandemLink = ({ profile, variant }: ProfileWithTandemLinkParams) => {
    const redirect = useRedirect();

    return (
        <Typography
            onClick={() => {
                redirect('show', 'profiles/with-tandem', profile.id);
            }}
            sx={{ cursor: 'pointer', color: '#3737d5', fontWeight: '700' }}
            // Note: shortcut to avoid typing as precisely as Typography (an error
            // will juste lead to syle not applied)
            variant={variant as any}
        >
            {getProfileDisplayName(profile)} ({codeLanguageToFlag(profile.nativeLanguage.code)})
        </Typography>
    );
};

export default ProfileWithTandemLink;
