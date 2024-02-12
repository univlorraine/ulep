import { AvatarPlaceholderPng } from "../../assets";
import User from "../../domain/entities/User";
import NetworkImage from "./NetworkImage";

interface AvatarProps {
    user?: User;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, className }) => {
    if (user?.avatar?.id) {
        return <NetworkImage id={user.avatar.id} placeholder={AvatarPlaceholderPng}  alt="avatar" className={className} />
    }

    return <img alt="avatar" src={AvatarPlaceholderPng} className={className} />;
};

export default Avatar;