import { Typography, TypographyProps } from '@mui/material';
import { useRedirect } from 'react-admin';
import { Profile, getProfileDisplayName } from '../../../entities/Profile';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';

interface ProfileLinkParams {
    profile: Profile;
    variant?: string;
}

const ProfileLink = ({ profile, variant = 'body1' }: ProfileLinkParams) => {
    const redirect = useRedirect();

    return (
        <Typography
            onClick={() => {
                redirect('show', 'profiles', profile.id);
            }}
            sx={{ cursor: 'pointer', color: '#3737d5' }}
            // Note: shortcut to avoid typing as precisely as Typography (an error
            // will juste lead to syle not applied)
            variant={variant as TypographyProps['variant']}
        >
            {getProfileDisplayName(profile)} ({codeLanguageToFlag(profile.nativeLanguage.code)})
        </Typography>
    );
};

export default ProfileLink;
