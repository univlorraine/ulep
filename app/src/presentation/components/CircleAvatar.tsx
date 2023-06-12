import './CircleAvatar.css';
interface CircleAvatarProps {
    backgroundImage: string;
    color?: string;
    radius?: string;
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({ backgroundImage, color = '#F8F9FA' }) => {
    const avatarStyle = {
        backgroundColor: color,
    };

    return (
        <div className="avatarView" style={avatarStyle}>
            <img src={backgroundImage} alt="avatar" className="avatar" />
        </div>
    );
};

export default CircleAvatar;
