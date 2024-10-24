import { useEffect, useState } from 'react';
import { AvatarPlaceholderPng } from '../../assets';
import User from '../../domain/entities/User';
import NetworkImage from './NetworkImage';

interface AvatarProps {
    user?: User;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, className }) => {
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        setRefresh(true);
    }, [user]);

    if (user?.id) {
        return (
            <NetworkImage
                id={user.id}
                placeholder={AvatarPlaceholderPng}
                alt="avatar"
                className={className}
                isRefresh={refresh}
                setRefresh={setRefresh}
            />
        );
    }

    return <img alt="avatar" src={AvatarPlaceholderPng} className={className} />;
};

export default Avatar;
