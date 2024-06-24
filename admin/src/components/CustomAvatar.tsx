import { Avatar } from '@mui/material';
import * as React from 'react';
import { useGetOne, ImageField, Identifier } from 'react-admin';

type CustomAvatarProps = {
    avatarId: Identifier;
    firstName: string;
    lastName: string;
    sx?: React.CSSProperties;
};

const CustomAvatar = ({ avatarId, firstName, lastName, sx }: CustomAvatarProps) => {
    const { data, isLoading, error } = useGetOne(
        'uploads',
        { id: avatarId },
        {
            retry: false,
        }
    );
    const label = `${firstName} ${lastName}`;

    if (error || isLoading || !data.url)
        return (
            <Avatar sx={sx}>
                {firstName.charAt(0)}
                {lastName.charAt(0)}
            </Avatar>
        );

    return (
        <Avatar sx={sx}>
            <ImageField label={label} record={data} source="url" title={String(label)} />
        </Avatar>
    );
};

export default CustomAvatar;
