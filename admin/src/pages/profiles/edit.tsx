import React from 'react';
import {
    useTranslate,
    Edit,
    WithRecord,
    useUpdate,
    useRedirect,
    useNotify,
    useGetIdentity,
    Loading,
} from 'react-admin';
import ProfileForm from '../../components/form/ProfileForm';
import PageTitle from '../../components/PageTitle';
import { Profile, ProfileFormPayload } from '../../entities/Profile';

const ProfileEdit = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();
    const identity = useGetIdentity();

    const handleSubmit = async (id: string, payload: ProfileFormPayload) => {
        try {
            const user = await update(
                'users',
                {
                    id,
                    data: payload,
                },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            return redirect('/profiles');
                        }

                        return notify('profiles.update.error');
                    },
                }
            );

            return { user };
        } catch (err) {
            console.error(err);

            return notify('profiles.update.error');
        }
    };

    if (!identity) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle>{translate('profiles.title')}</PageTitle>
            <Edit title={translate('profiles.update.title')}>
                <WithRecord<Profile>
                    label="profiles"
                    render={(record) => {
                        const isCentralUniversity = identity?.identity?.isCentralUniversity;
                        const adminUniversityId = identity?.identity?.universityId;
                        const profileUniversityId = record.user.university.id;

                        if (!isCentralUniversity && adminUniversityId !== profileUniversityId) {
                            return <div>{translate('profiles.update.unauthorized')}</div>;
                        }

                        return <ProfileForm handleSubmit={handleSubmit} record={record} />;
                    }}
                />
            </Edit>
        </>
    );
};

export default ProfileEdit;
