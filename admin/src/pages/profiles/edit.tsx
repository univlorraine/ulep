import React from 'react';
import { useTranslate, useNotify, useRedirect, useUpdate, Edit, WithRecord } from 'react-admin';
import ProfileForm from '../../components/form/ProfileForm';
import { Profile, ProfileFormPayload } from '../../entities/Profile';

const ProfileEdit = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleSubmit = async (payload: ProfileFormPayload) => {
        try {
            const user = await update(
                'users',
                {
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

    return (
        <Edit title={translate('profiles.update.title')}>
            <WithRecord<Profile>
                label="profiles"
                render={(record) => <ProfileForm handleSubmit={handleSubmit} record={record} />}
            />
        </Edit>
    );
};

export default ProfileEdit;
