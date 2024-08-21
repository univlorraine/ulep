import { Typography, TypographyProps } from '@mui/material';
import { useRedirect } from 'react-admin';
import { Profile } from '../../../entities/Profile';
import { ProfileWithTandemsProfiles } from '../../../entities/ProfileWithTandemsProfiles';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';

interface ProfileLinkParams {
    profile: Profile | ProfileWithTandemsProfiles;
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
            {profile.user.lastname} {profile.user.firstname} ({codeLanguageToFlag(profile.nativeLanguage.code)})
        </Typography>
    );
};

export default ProfileLink;
