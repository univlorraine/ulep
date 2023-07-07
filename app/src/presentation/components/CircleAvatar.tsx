import './CircleAvatar.css';
interface CircleAvatarProps {
    backgroundImage: string;
    height?: number;
    viewClassName?: string;
    width?: number;
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({ backgroundImage, height, viewClassName, width }) => {
    return (
        <div className={`avatarView ${viewClassName}`}>
            <img src={backgroundImage} style={{ height, width }} alt="avatar" className="avatar" />
        </div>
    );
};

export default CircleAvatar;
