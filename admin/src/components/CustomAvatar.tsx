import { Avatar } from '@mui/material';
import * as React from 'react';
import { useGetOne, ImageField, Identifier } from 'react-admin';

type CustomAvatarWithInitsProps = {
    firstName: string;
    lastName: string;
    sx?: React.CSSProperties;
};

const CustomAvatarWithInits = ({ firstName, lastName, sx }: CustomAvatarWithInitsProps) => (
    <Avatar sx={sx}>
        {firstName.charAt(0)}
        {lastName.charAt(0)}
    </Avatar>
);

type CustomAvatarWithImageProps = {
    avatarId: Identifier;
    firstName: string;
    lastName: string;
    sx?: React.CSSProperties;
};

const CustomAvatarWithImage = ({ avatarId, firstName, lastName, sx }: CustomAvatarWithImageProps) => {
    const { data, isLoading, error } = useGetOne(
        'uploads',
        { id: avatarId },
        {
            retry: false,
        }
    );
    const label = `${firstName} ${lastName}`;

    if (error || isLoading || !data.url)
        return <CustomAvatarWithInits firstName={firstName} lastName={lastName} sx={sx} />;

    return (
        <Avatar sx={sx}>
            <ImageField label={label} record={data} source="url" title={String(label)} />
        </Avatar>
    );
};

type CustomAvatarProps = {
    avatarId: Identifier;
    firstName: string;
    lastName: string;
    sx?: React.CSSProperties;
};

const CustomAvatar = ({ avatarId, firstName, lastName, sx }: CustomAvatarProps) => {
    if (avatarId) {
        return <CustomAvatarWithImage avatarId={avatarId} firstName={firstName} lastName={lastName} sx={sx} />;
    }

    return <CustomAvatarWithInits firstName={firstName} lastName={lastName} sx={sx} />;
};

export default CustomAvatar;
