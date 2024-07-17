import React from 'react';
import { Button, useRedirect } from 'react-admin';
import { Profile } from '../../../entities/Profile';

interface ProfileLinkParams {
    profile: Profile;
    learningLanguageCode: string;
}

const ProfileTandemDetailLink = ({ profile, learningLanguageCode }: ProfileLinkParams) => {
    const redirect = useRedirect();

    return (
        <Button
            onClick={() => {
                redirect('show', 'profiles/with-tandem', profile.id, {}, { learningLanguageCode });
            }}
            sx={{ cursor: 'pointer' }}
            variant="text"
        >
            <img alt="" src="/eye-icon.svg" style={{ width: '18px', height: '12px' }} />
        </Button>
    );
};

export default ProfileTandemDetailLink;
