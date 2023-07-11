import style from './CircleAvatar.module.css';
interface CircleAvatarProps {
    alt?: string;
    backgroundImage: string;
    height?: number;
    viewClassName?: string;
    width?: number;
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({
    alt = 'avatar',
    backgroundImage,
    height,
    viewClassName,
    width,
}) => {
    return (
        <div className={`${style.avatarView} ${viewClassName}`}>
            <img src={backgroundImage} style={{ height, width }} alt={alt} className={style.avatar} />
        </div>
    );
};

export default CircleAvatar;
