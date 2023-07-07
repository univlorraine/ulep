import style from './CircleAvatar.module.css';
interface CircleAvatarProps {
    backgroundImage: string;
    height?: number;
    viewClassName?: string;
    width?: number;
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({ backgroundImage, height, viewClassName, width }) => {
    return (
        <div className={`${style.avatarView} ${viewClassName}`}>
            <img src={backgroundImage} style={{ height, width }} alt="avatar" className={style.avatar} />
        </div>
    );
};

export default CircleAvatar;
