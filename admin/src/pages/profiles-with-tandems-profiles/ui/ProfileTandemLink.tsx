import { Typography, TypographyProps } from '@mui/material';
import { useRedirect } from 'react-admin';
import UserStatusChips from '../../../components/UserStatusChips';
import { Profile } from '../../../entities/Profile';
import { ProfileWithTandemsProfiles } from '../../../entities/ProfileWithTandemsProfiles';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';

interface ProfileTandemLinkParams {
    profile: Profile | ProfileWithTandemsProfiles;
    variant?: string;
}

const ProfileTandemLink = ({ profile, variant = 'body1' }: ProfileTandemLinkParams) => {
    const redirect = useRedirect();

    return (
        <Typography
            onClick={() => {
                redirect('show', 'profiles/with-tandems-profiles', profile.id);
            }}
            sx={{ cursor: 'pointer', color: '#3737d5', fontWeight: '700' }}
            // Note: shortcut to avoid typing as precisely as Typography (an error
            // will juste lead to syle not applied)
            variant={variant as TypographyProps['variant']}
        >
            {profile.user.lastname} {profile.user.firstname} ({codeLanguageToFlag(profile.nativeLanguage.code)})
            <span style={{ marginLeft: '10px' }}>
                <UserStatusChips status={profile.user.status} />
            </span>
        </Typography>
    );
};

export default ProfileTandemLink;
